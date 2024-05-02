import { Injectable } from '@nestjs/common';
import { GoogleAiService } from './GoogleAiService';
import { JobDescriptionDTO } from 'src/core/DTO/JobDescriptionDTO';


@Injectable()
export class MappingService {
    private jobDescriptionDTO: JobDescriptionDTO;
    constructor(private readonly googleAiService: GoogleAiService) {
    
    }

    compare(jobDescription: JobDescriptionDTO, resume: ResumeDTO): Promise<string> {
        
        // Đoạn code này để xử lý và phân tích các thông tin từ jobDescription và resume
        // Bạn có thể sử dụng các thuật toán xử lý ngôn ngữ tự nhiên, hoặc các thư viện phân tích văn bản như NLP.js hoặc Natural để phân tích và tìm kiếm thông tin trong văn bản
        // const jobExp = jobDescription.experience;
        // const jobSkill = jobDescription.skills;
        // const jobTitle = jobDescription.jobTitle;
        // const personalQualities = jobDescription.personalQualities;
        // const resumeEdu = resume.educations;
        // const profile = resume.profile;
        // const projects = resume.projects;
        // const resumeSkill = resume.skills;
        // const resumeExp = resume.workExperiences;
      
        // So sánh các kỹ năng
        // const matchedSkills = this.findMatchingSkills(jobSkills, resumeSkills); // Hàm findMatchingSkills là hàm tùy chỉnh để tìm các kỹ năng giống nhau từ Job Skills và Resume Skills
      
        // Tạo CV dựa trên kết quả so sánh
        // const generatedCV = this.generateCV(matchedSkills); // Hàm generateCV là hàm tùy chỉnh để tạo CV dựa trên kỹ năng đã tìm thấy
      
        return Promise.resolve("Not a match");
    //   }
      
      // findMatchingSkills(jobDescription: string, resume: string): string {

      //   return
      // }
      // generateCV(text: string): string {
        
      //   return
      // }
  }
}