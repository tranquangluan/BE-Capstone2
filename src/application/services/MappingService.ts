import { Injectable, NotFoundException } from '@nestjs/common';
import { GoogleAiService } from './GoogleAiService';
import { JobDescriptionDTO } from 'src/core/DTO/JobDescriptionDTO';
import { ResumeDTO } from 'src/core/DTO/ResumeDTO';
import { ResumeEducation, ResumeProject, ResumeSkills, ResumeWorkExperience, Resumes } from 'src/modules/FireBase/Entity/Resumes';
import { LanguageService } from './LanguageService';


@Injectable()
export class MappingService {
    constructor(private readonly googleAiService: GoogleAiService,
      private readonly languageSerVice: LanguageService
    ) {
    
    }

    async compare(jobDescription: JobDescriptionDTO, resume: ResumeDTO, uid: string, jd: string): Promise<Resumes> {
      if (!jobDescription) {
        throw new NotFoundException('Job description not found');
      }
      if (!resume) {
        throw new NotFoundException('Resume not found');
      }
        const jobExp = jobDescription.experience;
        const jobSkill = jobDescription.skills;  
        const jobEducation = jobDescription.educations;
        
        const resumeExp = resume.workExperiences;
        const resumeSkill = resume.skills;
        const resumeEdu = resume.educations;
        const resumeProjects = resume.projects;

        console.log("================Đầu vào ở đây===================")
        console.log(resumeExp)
        console.log(resumeSkill)
        console.log(resumeEdu)
        console.log(resumeProjects)
        

        const promptEdu = '. Và trả ra kết quả theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác:'
        +' {"school":"Trường trung học cơ sở, trung học phổ thông, cao đẳng, đại học ..." , "degree": "bằng cấp ","date":"ngày cấp bằng học tập, chứng chỉ" ,"gpa": "điểm học tập" ,"descriptions" :"mô tả, datatype là string[]",}.'
        +' . Và thực hiện theo yêu cầu sau:'
        +' 1. Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description, nếu dữ liệu trả về là mảng không có dữ liệu thì sẽ là mảng rỗng "[]", nếu là trường bình thường không có dữ liệu trả về "null". Tuyệt đối focus vào job description'
        +' 2. Nếu hoàn toàn không có dữ liệu nào tương thích thì trả về bằng cấp cao nhất trong hồ sơ năng lực.'
        +' Ví dụ cụ thể:' 
        +' Trường hợp 1: nếu job description không yêu cầu, không đề cập đến bằng cấp (undefined) thì trả về bằng cấp cao nhất trong hồ sơ năng lực theo cấu trúc {"school":"trường học" , "degree": "bằng cấp ","date":"ngày cấp bằng học tập, chứng chỉ" ,"gpa": "điểm học tập" ,"descriptions" :"mô tả, datatype là string[]",}.'
        +' Trường hợp 2: nếu job description có đề cập đến thì ở đâu đề cập ở đó có dữ liệu còn không có đề cập thì trả về "[]" cho mảng và "null" cho trường bình thường.'
        +' Trường hợp 3: nếu hồ sơ năng lực không có thì trả về [] nếu là mảng và null nếu là trường bình thường.'

        const promptExp = '. Và trả ra kết quả là 1 mảng theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác:'
        +' {[{"company": "Tên công ty", "jobTitle": "tên công việc làm tại công ty tương ứng","date": "ngày bắt đầu làm việc","descriptions":"[] datatype là string[]",}]}.'
        +' . Và thực hiện theo yêu cầu sau:'
        +' 1. Dữ liệu được trả về dưới dạng mảng nếu không có dữ liệu thì trả về mảng rỗng "[]", nếu là trường bình thường không có dữ liệu trả về "null". Nếu không tìm thấy dữ liệu nào thích hợp thì trả về đúng cấu trúc sau: {["company": "null", "jobTitle": "null","date": "null","descriptions":"[]",]}.'
        +' 2. Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description. Tuyệt đối focus vào job description'
        +' Ví dụ cụ thể:'
        +' Trường hợp 1: Nếu không tìm thấy dữ liệu nào thích hợp thì trả về đúng cấu trúc sau: {["company": "null", "jobTitle": "null","date": "null","descriptions":"[]",]}.';
        +' Trường hợp 2: nếu hồ sơ năng lực không có thì trả về mảng rỗng nếu là mảng và null nếu là trường bình thường.'
        +' Trường hợp 3: Trả về dữ liệu bình thường theo cấu trúc được yêu cầu ở trên nếu có dữ liệu.'
        const promptSkill = '. Và trả ra kết quả theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác. Phải trả dữ liệu về đủ 2 trường là featuredSkills và descriptions:'
        +' {"featuredSkills":"[] đây luôn luôn là mảng rỗng" , "descriptions":"[] datatype là string[]",}.'
        +' .Và thực hiện theo yêu cầu sau:'
        +' 1.Dữ liệu được trả về ở trường descriptions dưới dạng mảng, nếu không có dữ liệu thì trả về mảng rỗng.'
        +' 2.Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description. Tuyệt đối focus vào job description'
        +' 3.Trường "skill" phải ưu tiên tuyệt đối những kỹ năng chuyên ngành mà job description yêu cầu. ví dụ yêu cầu là 5 năm kinh nghiệm ngôn ngữ java nhưng hồ sơ năng lực lại có 7 năm c#, 3 năm java, 5 năm php. phải lấy ra được 3 năm kinh nghiệm java '
        +' Ví dụ cụ thể:'
        +' Trường hợp 1: Nếu không tìm thấy Skill nào thích hợp thì trả về {"featuredSkills":"[]" , "descriptions":"[]",}.';
        +' Trường hợp 2: nếu hồ sơ năng lực không có thì trả về mảng rỗng nếu là mảng và null nếu là trường bình thường.'
        +' Trường hợp 3: Trả về dữ liệu bình thường theo cấu trúc được yêu cầu ở trên nếu có dữ liệu.'
        const promptProj = '. Và trả ra kết quả là 1 mảng theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác:'
        +' {[{"project":"Dự án đã làm trong quá trình làm việc" ,"date":"thời gian làm dự án" ,"descriptions": "[] datatype là string[]"},]}.'
        +' . Và thực hiện theo yêu cầu sau:'
        +' 1. Dữ liệu được trả về dưới dạng mảng nếu không có dữ liệu thì trả về mảng rỗng, nếu trường nào không có dữ liệu thì mang giá trị null. Dự đoán giá trị của các trường null và trả về giá trị đó.'
        +' 2. Lấy ra những dự án từ hồ sơ năng lực tương ứng với yêu cầu của job description. Tuyệt đối focus vào job description'
        +' 3. Lấy ra thông tin project đặc biệt liên quan đến yêu cầu của job description. Ưu tiên lấy 2 đến 3 project có thời gian gần với hiện tại nhất.'
        +' Ví dụ cụ thể:'
        +' Trường hợp 1: Nếu không tìm thấy project nào thích hợp thì trả về {[{"project": "null" ,"date": "null" ,"descriptions": "[]",},]}.'
        +' Trường hợp 2: Trả về dữ liệu bình thường theo cấu trúc được yêu cầu ở trên nếu có dữ liệu.'
        const matchedExp = await this.findMatching(jobExp, JSON.stringify(resumeExp), promptExp); 
        const matchedSkill = await this.findMatching(jobSkill, JSON.stringify(resumeSkill),promptSkill);
        const matchedEdu = await this.findMatching(jobEducation, JSON.stringify(resumeEdu),promptEdu);
        const matchedProj = await this.mappingProject(jd, JSON.stringify(resumeProjects),promptProj);

        console.log("================Đầu ra sau khi vào promt ở đây===================")
        console.log("Exp" + matchedExp)
        console.log("Skill" + matchedSkill)
        console.log("Edu" + matchedEdu)
        console.log("Pro" + matchedProj)
        const expAfter = await this.languageSerVice.cleanInputPromt(matchedExp)
        const skillAfter = await this.languageSerVice.cleanInputPromt(matchedSkill)
        const eduAfter = await this.languageSerVice.cleanInputPromt(matchedEdu)
        const projAfter = await this.languageSerVice.cleanInputPromt(matchedProj)

        console.log("================Đầu ra sau khi clean đầu vào ở đây===================")
        console.log("Exp" + expAfter)
        console.log("Skill" + skillAfter)
        console.log("Edu" + eduAfter)
        console.log("Pro" + projAfter)
       
        try {
          const parsedExpData = JSON.parse(expAfter);
          const parsedSkillData = JSON.parse(skillAfter);
          const parsedEduData = JSON.parse(eduAfter);
          const parsedProjectData = JSON.parse(projAfter);
          const matchedExpResult: ResumeWorkExperience[] = parsedExpData;
          const matchedSkillResult: ResumeSkills = parsedSkillData;
          const matchedEduResult: ResumeEducation = parsedEduData;
          const matchedProjResult: ResumeProject[] = parsedProjectData;
          
          console.log("================Đầu ra sau khi parse dữ liệu để vào resume ở đây===================")
          console.log(matchedExpResult);
          console.log(matchedSkillResult)
          console.log(matchedEduResult);
          console.log(matchedProjResult);
          const resumes : Resumes={
            Resume: {
              profile: null,
              workExperiences: matchedExpResult,
              // educations: null,
              // projects: null,
              // skills: null,
              educations: matchedEduResult,
              projects: matchedProjResult,
              skills: matchedSkillResult,
              custom: null,
            },
            Settings: null,
            uid: uid,
          }
        return resumes;
        } catch (error) {
          console.error('Lỗi xảy ra khi phân tích chuỗi JSON:', error);
          throw new Error('Lỗi xảy ra khi phân tích chuỗi JSON');
        }
      }
    
      
    async findMatching(jobDescriptionField: string | string[], resumeField: string, prompt: string): Promise<string> {
      let require = 'từ đầu vào là jobDescription từ doanh nghiệp như sau: '
      + jobDescriptionField
      +' và dữ liệu từ hồ sơ năng lực của người dùng: ' + resumeField
      +' Dựa vào hồ sơ năng lực này, hãy tìm ra điểm giống nhau từ hồ sơ so với yêu cầu của doanh nghiệp, hãy lấy ra kết quả từ hồ sơ năng lực tuân theo jobDescription.'+ prompt;
      const result = await this.googleAiService.generateGeminiPro(require);
      return result;
    }
  
    async mappingProject(jobDescription: string | string[], resumeField: string, prompt: string): Promise<string> {
      let require = 'từ đầu vào là jobDescription từ doanh nghiệp như sau: '+ jobDescription
      +' và dữ liệu từ hồ sơ năng lực của người dùng: ' 
      + resumeField
      +' hãy dựa theo đoạn mô tả yêu cầu của jobDescription từ doanh nghiệp, tìm những dự án (projects) phù hợp lấy từ trong hồ sơ năng lực và trả về kết quả. Nếu dữ liệu có nhiều hơn 3 dự án phù hợp thì chọn ra 3 dự án ưu tiên theo 2 tiêu chí: 1. Dự án lớn nhất, 2. Thời gian gần với hiện tại nhất. '
      + prompt;
      const result = await this.googleAiService.generateGeminiPro(require);
      return result;
    }
}
