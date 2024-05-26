import { Injectable, NotFoundException } from '@nestjs/common';
import { GoogleAiService } from './GoogleAiService';
import { JobDescriptionDTO } from 'src/core/DTO/JobDescriptionDTO';
import { ResumeDTO } from 'src/core/DTO/ResumeDTO';
import {
  ResumeEducation,
  ResumeProject,
  ResumeSkills,
  ResumeWorkExperience,
  Resumes,
} from 'src/modules/FireBase/Entity/Resumes';
import { LanguageService } from './LanguageService';
import { log } from 'console';
import { json } from 'stream/consumers';
@Injectable()
export class MappingService {
  constructor(
    private readonly googleAiService: GoogleAiService,
    private readonly languageSerVice: LanguageService,
  ) {}
  async compare(
    jobDescription: JobDescriptionDTO,
    resume: ResumeDTO,
    uid: string,
    jd: string,
  ): Promise<Resumes> {
    const afterJDConverted: JobDescriptionDTO =
      typeof jobDescription == 'string'
        ? JSON.parse(jobDescription)
        : jobDescription;
    if (!jobDescription) {
      throw new NotFoundException('Job description not found');
    }
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    const jobExp = afterJDConverted.experience;
    const jobSkill = afterJDConverted.skills;
    const jobEducation = afterJDConverted.educations;
    const resumeExp = resume.workExperiences;
    const resumeSkill = resume.skills;
    const resumeEdu = resume.educations;
    const resumeProjects = resume.projects;
    const promptEdu =
      'Và trả ra kết quả là 1 mảng json theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác. Phải trả về đủ trường "school","degree","date","gpa","descriptions":' +
      ' [{"school":"Trường tiểu học, trung học cơ sở, trung học phổ thông, cao đẳng, đại học, ..." , "degree": "bằng cấp, chứng chỉ " , "date": "ngày cấp bằng học tập, chứng chỉ" ,"gpa": "điểm học tập" ,"descriptions" :"mô tả, datatype là string[]"},],.' +
      ' . Và thực hiện theo yêu cầu sau. Tôi chỉ trả ra kết quả, không cần quá trình:' +
      ' Trường hợp 1: Nếu hồ sơ năng lực không có dữ liệu thì trả về cấu trúc mảng như sau: [{"school": null , "degree": null,"date": null,"gpa":null ,"descriptions" :[]},],.' +
      ' Trường hợp 2: Nếu job description không yêu cầu, không đề cập đến bằng cấp (undefined) thì trả về bằng cấp cao nhất trong hồ sơ năng lực theo cấu trúc: [{"school":"trường học" , "degree": "bằng cấp ","date":"ngày cấp bằng học tập, chứng chỉ" ,"gpa": "điểm học tập" ,"descriptions" :"mô tả, datatype là string[]"},],.'
    const promptExp =
      'Và trả ra kết quả là 1 mảng theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác. Phải trả về đủ trường "company","jobTitle","date","descriptions":' +
      ' [{"company": "Tên công ty", "jobTitle": "tên công việc làm tại công ty tương ứng","date": "ngày bắt đầu làm việc","descriptions":"mô tả, datatype là string[]",},{data thứ 2 nếu có},],.' +
      ' . Và thực hiện theo yêu cầu sau. Tôi chỉ trả ra kết quả, không cần quá trình:' +
      ' Trường hợp 1: Nếu hồ sơ năng lực không có dữ liệu thì trả về đúng cấu trúc mảng như sau: [{"company": null, "jobTitle": null,"date": null,"descriptions":"[]",}],.' +
      ' Trường hợp 2: Nếu có dữ liệu thích hợp trả về dữ liệu bình thường theo cấu trúc sau:[{"company": "Tên công ty", "jobTitle": "tên công việc làm tại công ty tương ứng","date": "ngày bắt đầu làm việc","descriptions":"mô tả, datatype là string[]",},{data thứ 2 nếu có},],.' 
    const promptSkill =
      'Và trả ra kết quả theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác. Phải trả dữ liệu về đủ 2 trường là "featuredSkills" và "descriptions":' +
      ' {"featuredSkills":"[] đây luôn luôn là mảng rỗng" , "descriptions":"[] datatype là string[]"},.' +
      ' . Và thực hiện theo yêu cầu sau. Tôi chỉ trả ra kết quả, không cần quá trình:' +
      ' 1. Dữ liệu được trả về ở trường descriptions dưới dạng mảng, nếu không có dữ liệu thì trả về mảng rỗng "[]".' +
      ' 2. Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description. Tuyệt đối focus vào job description' +
      ' 3. Trường "descriptions" phải ưu tiên tuyệt đối những kỹ năng chuyên ngành mà job description yêu cầu. Ví dụ yêu cầu là 5 năm kinh nghiệm ngôn ngữ java nhưng hồ sơ năng lực lại có 7 năm c#, 3 năm java, 5 năm php. phải lấy ra được 3 năm kinh nghiệm java. ' +
      ' Ví dụ cụ thể:' +
      ' Trường hợp 1: Nếu hồ sơ năng lực không có dữ liệu nào thích hợp thì trả về đúng cấu trúc: {"featuredSkills":"[]" , "descriptions":"[]",}.' +
      ' Trường hợp 2: Nếu có dữ liệu thích hợp trả về dữ liệu bình thường theo cấu trúc sau:{"featuredSkills":"[] đây luôn luôn là mảng rỗng" , "descriptions":"[] datatype là string[]"}.'
    const promptProj =
      'Và trả ra kết quả là 1 mảng theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác. Phải trả về đủ trường "project","date","descriptions":' +
      ' [{"project":"Dự án đã làm trong quá trình làm việc" ,"date":"thời gian làm dự án" ,"descriptions": "mô tả, datatype là string[]"},{dữ liệu thứ 2 nếu có}],.' +
      ' . Và thực hiện theo yêu cầu sau. Tôi chỉ trả ra kết quả, không cần quá trình:' +
      ' Trường hợp 1: Nếu không tìm thấy dữ liệu nào thích hợp thì trả về dữ liệu theo đúng cấu trúc: [{"project": null ,"date": null ,"descriptions": []},].' +
      ' Trường hợp 2: Nếu hồ sơ năng lực có dữ liệu thích hợp, ưu tiên lấy 2 đến 3 project có thời gian gần với hiện tại nhất(so sánh bằng date) và trả về theo cấu trúc: [{"project":"Dự án đã làm trong quá trình làm việc" ,"date":"thời gian làm dự án" ,"descriptions": "mô tả, datatype là string[]"},{dữ liệu thứ 2 nếu có}].'

    const matchedExp = await this.findMatching(
      jobExp,
      JSON.stringify(resumeExp),
      promptExp,
    );
    const matchedSkill = await this.findMatching(
      jobSkill,
      JSON.stringify(resumeSkill),
      promptSkill,
    );
    const matchedEdu = await this.findMatching(
      jobEducation,
      JSON.stringify(resumeEdu),
      promptEdu,
    );
    const matchedProj = await this.mappingProject(
      jd,
      JSON.stringify(resumeProjects),
      promptProj,
    );
    console.log('======Đầu ra sau map========');

    console.log(matchedExp);
    console.log(matchedSkill);
    console.log(matchedEdu);
    console.log(matchedProj);
    const expAfter = await this.languageSerVice.cleanInputPromt(matchedExp);
    const skillAfter = await this.languageSerVice.cleanInputPromt(matchedSkill);
    const eduAfter = await this.languageSerVice.cleanInputPromt(matchedEdu);
    const projAfter = await this.languageSerVice.cleanInputPromt(matchedProj);
    console.log('======Đầu ra sau clean========');

    console.log(expAfter);
    console.log(skillAfter);
    console.log(eduAfter);
    console.log(projAfter);
    try {
      const parsedExpData = JSON.parse(expAfter);
      const parsedSkillData = JSON.parse(skillAfter);
      const parsedEduData = JSON.parse(eduAfter);
      const parsedProjectData = JSON.parse(projAfter);
      const matchedExpResult: ResumeWorkExperience[] = parsedExpData;
      const matchedSkillResult: ResumeSkills = parsedSkillData;
      const matchedEduResult: ResumeEducation[] = parsedEduData;
      const matchedProjResult: ResumeProject[] = parsedProjectData;
      console.log('=====Đầu ra sau khi parse======');
      console.log(matchedExpResult);
      console.log(matchedSkillResult);
      console.log(matchedEduResult);
      console.log(matchedProjResult);
      const resumes: Resumes = {
        Resume: {
          profile: null,
          workExperiences: matchedExpResult,
          educations: matchedEduResult,
          projects: matchedProjResult,
          skills: matchedSkillResult,
          custom: null,
        },
        Settings: null,
        uid: uid,
      };
      return resumes;
    } catch (error) {
      console.error('Lỗi xảy ra khi phân tích chuỗi JSON:', error);
      throw new Error('Lỗi xảy ra khi phân tích chuỗi JSON');
    }
  }

  async findMatching(
    jobDescriptionField: string | string[],
    resumeField: string,
    prompt: string,
  ): Promise<string> {
    let require =
      'từ đầu vào là jobDescription từ doanh nghiệp như sau: ' +
      jobDescriptionField +
      ' và dữ liệu từ hồ sơ năng lực của người dùng: ' +
      resumeField +
      ' Dựa vào hồ sơ năng lực này, hãy tìm ra điểm giống nhau từ hồ sơ so với yêu cầu của doanh nghiệp, hãy lấy ra kết quả từ hồ sơ năng lực tuân theo jobDescription. ' +
      prompt;
    const result = await this.googleAiService.generateGeminiPro(require);
    return result;
  }

  async mappingProject(
    jobDescription: string | string[],
    resumeField: string,
    prompt: string,
  ): Promise<string> {
    let require =
      'từ đầu vào là jobDescription từ doanh nghiệp như sau: ' +
      jobDescription +
      ' và dữ liệu từ hồ sơ năng lực của người dùng: ' +
      resumeField +
      ' hãy dựa theo đoạn mô tả yêu cầu của jobDescription từ doanh nghiệp, tìm những dự án (projects) phù hợp lấy từ trong hồ sơ năng lực và trả về kết quả. Nếu dữ liệu có nhiều hơn 3 dự án phù hợp thì chọn ra 3 dự án ưu tiên theo 2 tiêu chí: 1. Dự án lớn nhất, 2. Thời gian gần với hiện tại nhất. ' +
      prompt;
    const result = await this.googleAiService.generateGeminiPro(require);
    return result;
  }
}
