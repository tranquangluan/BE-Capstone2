import { Injectable } from '@nestjs/common';
import { GoogleAiService } from './GoogleAiService';
import { JobDescriptionDTO } from 'src/core/DTO/JobDescriptionDTO';

@Injectable()
export class LanguageService {

  // Initialize Object
  private jobDescriptionDTO: JobDescriptionDTO;

  // Inject dependencies
  constructor(private readonly googleAiService: GoogleAiService) {
    
  }

  // Set value for jobDescriptionDTO
  public async setJobDesciptionDTO(temp: JobDescriptionDTO ): Promise<void> {
    this.jobDescriptionDTO = temp;
  }

  // Detect the language using in CV
  public async detectLanguage(content: string): Promise<string> {
    const prompt = `Hãy xác định mã ngôn ngữ từ đoạn văn và trả về dữ liệu dựa vào tiêu chuẩn mã ngôn ngữ ISO 639. Ví dụ như Tiếng Việt sẽ là vi \n"${content}"`;
    const result = await this.googleAiService.generateGeminiPro(prompt);
    const myArray = this.getAllLanguages();

    const sliced = result.substring(0, 2);
    
    if ((await myArray).includes(sliced)) {
      return sliced;
    }
    return 'false';
  }

  // Rewrite content of a specific title and label name to a professional description
  public async rewrite(
    title: string,
    labelName: string,
    content: string,
  ): Promise<string> {
    // Chưa handle việc rewrite để mapping với JD
    const language = await this.detectLanguage(content);
    console.log(this.jobDescriptionDTO);
    
    if (language === 'false') {
      return 'Không thể xác định được ngôn ngữ';
    }
    let prompt = '';
    if (language === 'vi') {
      prompt = `Hãy viết lại nội dung ${content} của danh mục là ${title} của ${labelName} một cách chuyên nghiệp nhất với các yêu cầu là bằng tiếng việt. Nội dung phải mô tả về công ty hoặc lĩnh vực đang làm việc(nếu có). Liệt kê được vai trò, đóng góp của bản thân (nếu có). Nêu lên được thành tựu trong quá trình làm việc (nếu có).Kết quả trả về phải là một đoạn văn xuôi`;
    } else if (language === 'en') {
      prompt = `Với tư cách là một chuyên gia về sửa CV, hãy viết lại nội dung ${content} của danh mục là ${title} của ${labelName} một cách chuyên nghiệp nhất với các yêu cầu là bằng tiếng anh. 
      Nội dung phải mô tả về công ty hoặc lĩnh vực đang làm việc(nếu có). 
      Liệt kê được vai trò, đóng góp của bản thân (nếu có). Nêu lên được thành tựu trong quá trình làm việc (nếu có). 
      Kết quả trả về phải là một đoạn văn xuôi`;
    } 

    let result;
    if (prompt.length !== 0) {
      result = await this.googleAiService.generateGeminiPro(prompt);
    } else {
      return 'Your language is not supported in this version!';
    }
    return result;
  }

  // Get all languages code base on ISO-639-1
  public async getAllLanguages(): Promise<string[]> {
    const ISO6391 = require('iso-639-1');
    const myArray: string[] = ISO6391.getAllCodes();
    return myArray;
  }

  // Convert to plain text
  public async preProcessJD(contentJD: string): Promise<string> {
    let prompt = `Hãy xử lý loại bỏ các ký từ thừa và trả về một đoạn văn xuôi từ dữ liệu sau ${contentJD}`;
    const result = await this.googleAiService.generateGeminiPro(prompt);
    return result;
  }

  // Convert JD text to a JD entity
  public async convertJDToDTO(contentJD: string): Promise<JobDescriptionDTO> {
    try {
      const json = JSON.parse(contentJD);
      
      let jobDescription = new JobDescriptionDTO(
        json.JobTitle,
        json.JobObjective,
        json.Skills,
        json.Experience,
        json.PersonalQualities,
      );
      this.setJobDesciptionDTO(jobDescription);
      
      return jobDescription;
    } catch (error) {
      throw new Error(`Failed to convert JD to DTO: ${error.message}`);
    }
  }
}
