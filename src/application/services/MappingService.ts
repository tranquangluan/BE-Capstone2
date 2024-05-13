import { Injectable } from '@nestjs/common';
import { GoogleAiService } from './GoogleAiService';
import { JobDescriptionDTO } from 'src/core/DTO/JobDescriptionDTO';
import { ResumeDTO } from 'src/core/DTO/ResumeDTO';
import { resumes } from 'src/modules/FireBase/Entity/Resumes';
import { Resume } from '../../modules/FireBase/Entity/Resumes';
import { CoreApiResponse } from 'src/core/common/api/CoreApiResponse';


@Injectable()
export class MappingService {
    private jobDescriptionDTO: JobDescriptionDTO;
    constructor(private readonly googleAiService: GoogleAiService) {
    
    }

    async compare(jobDescription: JobDescriptionDTO, resume: ResumeDTO): Promise<CoreApiResponse<resumes>> {
        const jobTitle = jobDescription.jobTitle;
        console.log(typeof(jobTitle));
        
        const jobExp = jobDescription.experience;
        const jobSkill = jobDescription.skills;  
        const jobEducation = jobDescription.educations;
        const personalQualities = jobDescription.personalQualities;
        
        
        const resumeExp = resume.workExperiences;
        const resumeSkill = resume.skills;
        const resumeEdu = resume.educations;
        const projects = resume.projects;

        const promptEdu = 'và trả ra kết quả theo cấu trúc giống với cấu trúc như sau:{"school":"" , "degree": "","date":"" ,"gpa": "" ,"descriptions" :"[{},{}]",}';
        const promptExp = 'và trả ra kết quả theo cấu trúc giống với cấu trúc như sau:{"company": "", "jobTitle": "","date": "","descriptions":"[{},{}]",}';
        const promptSkill = 'và trả ra kết quả theo cấu trúc giống với cấu trúc như sau:{"featuredSkills":"[{"skill":"" ,"rating":"" ,}]" ,descriptions:"[{},{},]",}';
        const promptProj = 'và trả ra kết quả theo cấu trúc giống với cấu trúc như sau:[{"project":"" ,"date":"" ,"descriptions": "[{},]",},]';
        
        const matchedExp = this.findMatching(jobExp, resumeExp.toString(), promptEdu); 
        const matchedSkill = this.findMatching(jobSkill, resumeSkill.toString(),promptExp);
        const matchedEdu = this.findMatching(jobEducation, resumeEdu.toString(),promptSkill);
        const matchedProj = this.findMatching(jobExp, projects.toString(),promptProj);
        const matchedExpResult = JSON.parse(await matchedExp)
        

        const res: Resume = {
          profile: {
            name: null,
            email: null,
            phone: null,
            url: null,
            summary: null,
            location: null,
          },
          workExperiences: [
            {
              company: null,
              jobTitle: null,
              date: null,
              descriptions: [],
            }
          ],
          educations: {
            school: null,
            degree: null,
            date: null,
            gpa: null,
            descriptions: [],
          },
          projects: [
            {
              project: null,
              date: null,
              descriptions: [],
            },
          ],
          skills: {
            featuredSkills: [
              {
                skill: null,
                rating: null,
              }
            ],
            descriptions: [],
          },
          custom: {
            descriptions: [],
          },
        };
        let resumes = this.convertResumeToDTO(null)
        return resumes;
        return null;
      }
      
    async findMatching(jobDescriptionField: string | string[], resumeField: string, prompt: string): Promise<string> {
      let require = 'từ đầu vào là jobDescription'+jobDescriptionField.toString() 
      +'và hồ sơ năng lực của người dùng' + resumeField.toString() + prompt;
      const result = await this.googleAiService.generateGeminiPro(prompt);
      return null;
    }
  public async convertResumeToDTO(resumeData: Resume): Promise<CoreApiResponse<resumes>> {
    try {
      let resume = new resumes(resumeData,null);      
      return CoreApiResponse.success(resume);
    } catch (error) {
      throw new Error(`Failed to convert JD to DTO: ${error.message}`);
    }
  }
}