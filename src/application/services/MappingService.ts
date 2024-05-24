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
import { LanguageService } from './LanguageService';


@Injectable()
export class MappingService {
    constructor(private readonly googleAiService: GoogleAiService,
      private readonly languageSerVice: LanguageService
    ) {
    
    }

    async compare(jobDescription: JobDescriptionDTO, resume: ResumeDTO, uid: string): Promise<CoreApiResponse<Resumes>> {
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
        

        const promptEdu = 'và trả ra kết quả theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác:'
        +' {"school":"Trường trung học cơ sở, trung học phổ thông, cao đẳng, đại học ..." , "degree": "bằng cấp ","date":"ngày cấp bằng học tập, chứng chỉ" ,"gpa": "điểm học tập" ,"descriptions" :"mô tả, datatype là string[]",}.'
        +' Với yêu cầu sau:'
        +' 1.Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description, nếu dữ liệu trả về là mảng không có dữ liệu thì sẽ là mảng rỗng [], nếu là trường bình thường không có dữ liệu trả về null. Tuyệt đối focus vào job description'
        +' 2.Nếu hoàn toàn không có dữ liệu nào tương thích thì trả về bằng cấp cao nhất trong hồ sơ năng lực.'
        +' Ví dụ:' 
        +' Trường hợp 1: nếu job description không yêu cầu, không đề cập đến bằng cấp (undefined) thì trả về bằng cấp cao nhất trong hồ sơ năng lực.'
        +' Trường hợp 2: nếu job description có đề cập đến thì ở đâu đề cập ở đó có dữ liệu còn không có đề cập thì trả về [] cho mảng và null cho trường.'

        const promptExp = 'và trả ra kết quả là 1 mảng json theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác:'
        +'{[{"company": "Tên công ty", "jobTitle": "tên công việc làm tại công ty tương ứng","date": "ngày bắt đầu làm việc","descriptions":"[{},{}] datatype là string[]",}]}.'
        +' 1.Dữ liệu được trả về dưới dạng mảng nếu không có dữ liệu thì trả về mảng rỗng, nếu trường nào không có dữ liệu thì mang giá trị null. Dự đoán giá trị của các trường null và trả về giá trị đó.'
        +' 2.Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description. Tuyệt đối focus vào job description'
        +' Ví dụ:';

        const promptSkill = 'và trả ra kết quả theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác:'
        +'{"featuredSkills":"[] đây là mảng rỗng" ,descriptions:"[{},{},] datatype là string[]",}.'
        +' 1.Dữ liệu được trả về ở trường descriptions dưới dạng mảng, nếu không có dữ liệu thì trả về mảng rỗng.'
        +' 2.Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description. Tuyệt đối focus vào job description'
        +' 3.Trường "skill" phải ưu tiên tuyệt đối những kỹ năng chuyên ngành mà job description yêu cầu. ví dụ yêu cầu là 5 năm kinh nghiệm ngôn ngữ java nhưng hồ sơ năng lực lại có 7 năm c#, 3 năm java, 5 năm php. phải lấy ra được 3 năm kinh nghiệm java '
        +' Ví dụ:';

        const promptProj = 'và trả ra kết quả là 1 mảng json theo cấu trúc hoàn toàn giống như sau và không dư thừa gì khác:'
        +'{[{"project":"Dự án đã làm trong quá trình làm việc" ,"date":"thời gian làm dự án" ,"descriptions": "[{},] datatype là string[]",},]}.'
        +' 1.Dữ liệu được trả về dưới dạng mảng nếu không có dữ liệu thì trả về mảng rỗng, nếu trường nào không có dữ liệu thì mang giá trị null. Dự đoán giá trị của các trường null và trả về giá trị đó.'
        +' 2.Lấy ra những mục từ hồ sơ năng lực tương ứng với yêu cầu của job description. Tuyệt đối focus vào job description'
        +' 3.Lấy ra thông tin project đặc biệt liên quan đến yêu cầu của job description. Ưu tiên lấy 2 đến 3 project có thời gian gần với hiện tại nhất.'
        +' Ví dụ:';
        const matchedExp = await this.findMatching(jobExp, JSON.stringify(resumeExp), promptExp); 
        const matchedSkill = await this.findMatching(jobSkill, JSON.stringify(resumeSkill),promptSkill);
        const matchedEdu = await this.findMatching(jobEducation, JSON.stringify(resumeEdu),promptEdu);
        const matchedProj = await this.findMatching(jobExp, JSON.stringify(resumeProjects),promptProj);
        console.log(matchedExp)
        const expAfter = await this.languageSerVice.cleanInputPromt(matchedExp)
        const skillAfter = await this.languageSerVice.cleanInputPromt(matchedSkill)
        const eduAfter = await this.languageSerVice.cleanInputPromt(matchedEdu)
        const projAfter = await this.languageSerVice.cleanInputPromt(matchedProj)
        // console.log(matchedSkill)
        // console.log(matchedEdu)
        // console.log(matchedProj)
    


        try {
          const parsedExpData = JSON.parse(expAfter);
          let matchedExpResult: ResumeWorkExperience[] = parsedExpData;
          const parsedSkillData = JSON.parse(skillAfter);
          const matchedSkillResult: ResumeSkills = parsedSkillData;
          const parsedEduData = JSON.parse(eduAfter);
          const matchedEduResult: ResumeEducation = parsedEduData;
          const parsedProjectData = JSON.parse(projAfter);
          const matchedProjResult: ResumeProject[] = parsedProjectData;
          const resumes : Resumes={
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
          }
        return CoreApiResponse.success(resumes);
        } catch (error) {
          console.error('Lỗi xảy ra khi phân tích chuỗi JSON:', error);
        }
      }
    
      
    async findMatching(jobDescriptionField: string | string[], resumeField: string, prompt: string): Promise<string> {
      let require = 'từ đầu vào là jobDescription từ doanh nghiệp như sau: '+ jobDescriptionField
      +' và hồ sơ năng lực của người dùng: ' + resumeField
      +' hãy tìm ra điểm giống nhau của cả 2, hãy lấy ra kết quả '+ prompt;
      const result = await this.googleAiService.generateGeminiPro(require);
      return result;
    }
  
}
