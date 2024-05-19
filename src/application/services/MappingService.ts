import { Injectable, NotFoundException } from '@nestjs/common';
import { GoogleAiService } from './GoogleAiService';
import { JobDescriptionDTO } from 'src/core/DTO/JobDescriptionDTO';
import { ResumeDTO } from 'src/core/DTO/ResumeDTO';
import { ResumeEducation, ResumeProject, ResumeSkills, ResumeWorkExperience, Resumes } from 'src/modules/FireBase/Entity/Resumes';
import { Resume } from '../../modules/FireBase/Entity/Resumes';
import { CoreApiResponse } from 'src/core/common/api/CoreApiResponse';
import { Experiences } from 'src/modules/FireBase/Entity/Experiences';
import { Skills } from 'src/modules/FireBase/Entity/Skills';
import { Education } from 'src/modules/FireBase/Entity/Education';
import { Projects } from 'src/modules/FireBase/Entity/Projects';
import { json } from 'stream/consumers';
import { plainToClass } from 'class-transformer';


@Injectable()
export class MappingService {
    constructor(private readonly googleAiService: GoogleAiService) {
    
    }

    async compare(jobDescription: JobDescriptionDTO, resume: ResumeDTO): Promise<CoreApiResponse<Resumes>> {
      // if (!jobDescription) {
      //   throw new NotFoundException('Job description not found');
      // }
      // if (!resume) {
      //   throw new NotFoundException('Resume not found');
      // }
      //   const jobExp = jobDescription.experience;
      //   const jobSkill = jobDescription.skills;  
      //   const jobEducation = jobDescription.educations;
      //   console.log(jobExp)
      //   console.log(jobSkill)
      //   console.log(jobEducation)
        
      //   const resumeExp = resume.workExperiences;
      //   const resumeSkill = resume.skills;
      //   const resumeEdu = resume.educations;
      //   const resumeProjects = resume.projects;
      //   console.log(resumeExp)
      //   console.log(resumeSkill)
      //   console.log(resumeEdu)
      //   console.log(resumeProjects)

      //   const promptEdu = 'và trả ra kết quả theo cấu trúc như sau:'
      //   +' {"school":"Trường trung học cơ sở, trung học phổ thông, cao đẳng, đại học ..." , "degree": "chứng chỉ trong quá trình học tập và làm việc","date":"ngày cấp bằng tương ứng với học tập, chứng chỉ" ,"gpa": "điểm học tập" ,"descriptions" :"[{},{}]",}.'
      //   +' Với yêu cầu sau:'
      //   +' 1.Nếu không có dữ liệu nào tương thích thì trả về bằng cấp cao nhất trong hồ sơ năng lực.'
      //   +' 2.Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description, nếu không có, trả về null cho những trường đó. Tuyệt đối focus vào job description'
      //   +' Ví dụ:';

      //   const promptExp = 'và trả ra kết quả với các trường có nội dung như sau:'
      //   +'[{"company": "Tên công ty", "jobTitle": "tên công việc làm tại công ty tương ứng","date": "ngày bắt đầu làm việc","descriptions":"[{},{}]",}].'
      //   +' 1.Dữ liệu được trả về dưới dạng mảng nếu không có dữ liệu thì trả về mảng rỗng, nếu trường nào không có dữ liệu thì mang giá trị null. Dự đoán giá trị của các trường null và trả về giá trị đó.'
      //   +' 2.Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description. Tuyệt đối focus vào job description'
      //   +' Ví dụ:';

      //   const promptSkill = 'và trả ra kết quả với các trường có nội dung như sau:'
      //   +'{"featuredSkills":"[{"skill":"kỹ năng trong hồ sơ năng lực" ,"rating":"đánh giá kỹ năng đó theo mức độ tốt tăng dần 1,2,3,4,5" ,}]" ,descriptions:"[{},{},]",}.'
      //   +' 1.Dữ liệu được trả về dưới dạng mảng nếu không có dữ liệu thì trả về mảng rỗng, nếu trường nào không có dữ liệu thì mang giá trị null. Dự đoán giá trị của các trường null và trả về giá trị đó.'
      //   +' 2.Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description. Tuyệt đối focus vào job description'
      //   +' 3.Trường "skill" phải ưu tiên tuyệt đối những kỹ năng chuyên ngành mà job description yêu cầu. ví dụ yêu cầu là 5 năm kinh nghiệm ngôn ngữ java nhưng hồ sơ năng lực lại có 7 năm c#, 3 năm java, 5 năm php. phải lấy ra được 3 năm kinh nghiệm java '
      //   +' Ví dụ:';

      //   const promptProj = 'và trả ra kết quả với các trường có nội dung như sau:'
      //   +'[{"project":"Dự án đã làm trong quá trình làm việc" ,"date":"thời gian làm dự án" ,"descriptions": "[{},]",},].'
      //   +' 1.Dữ liệu được trả về dưới dạng mảng nếu không có dữ liệu thì trả về mảng rỗng, nếu trường nào không có dữ liệu thì mang giá trị null. Dự đoán giá trị của các trường null và trả về giá trị đó.'
      //   +' 2.Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description. Tuyệt đối focus vào job description'
      //   +' 3.Lấy ra thông tin project đặc biệt liên quan đến yêu cầu của job description. Ưu tiên lấy 2 đến 3 project có thời gian gần với hiện tại nhất.'
      //   +' Ví dụ:';
        
      //   const matchedExp = await this.findMatching(jobExp, JSON.stringify(resumeExp), promptEdu); 
      //   const matchedSkill = await this.findMatching(jobSkill, JSON.stringify(resumeSkill),promptExp);
      //   const matchedEdu = await this.findMatching(jobEducation, JSON.stringify(resumeEdu),promptSkill);
      //   const matchedProj = await this.findMatching(jobExp, JSON.stringify(resumeProjects),promptProj);
      //   console.log(matchedExp)
      //   console.log(matchedSkill)
      //   console.log(matchedEdu)
      //   console.log(matchedProj)
      //   try {
      //     const matchedExpResult: ResumeWorkExperience = JSON.parse(await matchedExp);
      //     console.log(matchedExpResult)
      //     const matchedSkillResult: ResumeSkills = JSON.parse(await matchedSkill);
      //     console.log(matchedSkillResult)
      //     const matchedEduResult: ResumeEducation = JSON.parse(await matchedEdu);
      //     console.log(matchedEduResult)
      //     const matchedProjResult: ResumeProject = JSON.parse(await matchedProj);
      //     console.log(matchedProjResult)
      //     const resumes : Resumes={
      //       Resume: {
      //       profile: {
      //         name: null,
      //         email: null,
      //         phone: null,
      //         url: null,
      //         summary: null,
      //         location: null,
      //       },
      //       workExperiences: [
      //         {
      //           company: matchedExpResult.company,
      //           jobTitle: matchedExpResult.jobTitle,
      //           date: matchedExpResult.date,
      //           descriptions: matchedExpResult.descriptions,
      //         }
      //       ],
      //       educations: {
      //         school: matchedEduResult.school,
      //         degree: matchedEduResult.degree,
      //         date: matchedEduResult.date,
      //         gpa: matchedEduResult.gpa,
      //         descriptions: [],
      //       },
      //       projects: [
      //         {
      //           project: matchedProjResult.project,
      //           date: matchedProjResult.date,
      //           descriptions: matchedProjResult.descriptions,
      //         },
      //       ],
      //       skills: {
      //         featuredSkills: matchedSkillResult.featuredSkills,
      //         descriptions: matchedSkillResult.descriptions,
      //       },
      //       custom: {
      //         descriptions: [],
      //       },
      //     },
      //     Settings: null,
      //   }
      //   return CoreApiResponse.success(resumes);
      //   } catch (error) {
      //     console.error('Lỗi xảy ra khi phân tích chuỗi JSON:', error);
      //   }
      return null
      }
      
    async findMatching(jobDescriptionField: string | string[], resumeField: string, prompt: string): Promise<string> {
      let require = 'từ đầu vào là jobDescription từ doanh nghiệp như sau: '+jobDescriptionField
      +' và hồ sơ năng lực của người dùng: ' + resumeField
      +' hãy tìm ra điểm giống nhau của cả 2, hãy lấy ra kết quả '+prompt;
      const result = await this.googleAiService.generateGeminiPro(require);
      return result;
    }
  
}