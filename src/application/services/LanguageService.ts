import { Injectable } from '@nestjs/common';
import { GoogleAiService } from './GoogleAiService';
import { JobDescriptionDTO } from 'src/core/DTO/JobDescriptionDTO';
import { RedisService } from './RedisService';

@Injectable()
export class LanguageService {
  constructor(
    private readonly googleAiService: GoogleAiService,
    private readonly redisService: RedisService,
  ) {}
  public async cleanString(input: string):  Promise<string> {
    // Sử dụng biểu thức chính quy để loại bỏ các dấu xuống dòng và khoảng trắng thừa
    return input.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  }
  public async detectLanguage(content: string): Promise<string> {
    const cleanText = await this.cleanString(content);
    console.log(cleanText);
    
    const prompt = `Hãy xác định mã ngôn ngữ từ đoạn văn và trả về dữ liệu dựa vào tiêu chuẩn mã ngôn ngữ ISO 639-1. Ví dụ như Tiếng Việt sẽ là vi, Tiếng anh sẽ là en. "${cleanText}"`;
    const result = await this.googleAiService.generateGeminiPro(prompt);
    const myArray = this.getAllLanguages();
    const sliced = result.substring(0, 2);
    console.log(sliced);
    
    if ((await myArray).includes(sliced)) {
      return sliced;
    }
    return 'false';
  }
  public async checkUserExisted(userId: string) {
    const rs = await this.redisService.get(userId);
    if (typeof rs !== 'undefined') {
    }
  }
  public async rewrite(userId: string,title: string,labelName: string,content: string): Promise<string> {
    console.log(userId);
    
    const JD = await this.redisService.getObject(userId);
    console.log(JD);
    
    let jobDescription;
    try {
      const json = JSON.parse(JD);
      jobDescription = new JobDescriptionDTO(
        json.jobTitle,
        json.jobObjective,
        json.educations,
        json.skills,
        json.experience,
        json.personalQualities,
      );
    } catch (error) {
      throw new Error(`Không thể convert JD to DTO: ${error.message}`);
    }
    console.log(jobDescription)
    const language = await this.detectLanguage(content);
    if (language === 'false') {
      return 'Không thể xác định được ngôn ngữ';
    }
    let skills =
      jobDescription.skills ||
      'Kỹ năng giao tiếp, Tư duy logic và giải quyết vấn đề';
      
    let prompt = '';
    if (language === 'vi') {
      prompt = `Hãy viết lại nội dung ${content} của danh mục là ${title} của ${labelName} một cách chuyên nghiệp nhất với các yêu cầu là bằng tiếng việt. 
      Nội dung phải mô tả về công ty hoặc lĩnh vực đang làm việc (nếu có) và nên thể hiên được các kỹ năng liên quan đến ${skills}. 
      Liệt kê được vai trò, đóng góp của bản thân (nếu có). Nêu lên được thành tựu trong quá trình làm việc (nếu có). 
      Kết quả trả về phải là một đoạn văn xuôi 100 từ`;
    } else if (language === 'en') {
      prompt = `Hãy viết lại nội dung ${content} của danh mục là ${title} của ${labelName} một cách chuyên nghiệp nhất với các yêu cầu là bằng tiếng anh. 
      Nội dung phải mô tả về công ty hoặc lĩnh vực đang làm việc (nếu có) và nên liên quan đến ${skills}. 
      Liệt kê được vai trò, đóng góp của bản thân (nếu có). Nêu lên được thành tựu trong quá trình làm việc (nếu có). 
      Kết quả trả về phải là một đoạn văn xuôi 100 từ`;
    }
    let result;
    if (prompt.length !== 0) {
      result = await this.googleAiService.generateGeminiPro(prompt);
    } else {
      return 'Ngôn ngữ của bạn không được hỗ trợ trong phiên bản này!';
    }
    return result;
  }

  
  public async getAllLanguages(): Promise<string[]> {
    const ISO6391 = require('iso-639-1');
    const myArray: string[] = ISO6391.getAllCodes();
    return myArray;
  }

  
  public async preProcessJD(contentJD: string): Promise<string> {
    let prompt = `Hãy chỉ xử lý loại bỏ các ký tự thừa và trả về một đoạn văn xuôi từ dữ liệu sau ${contentJD}`;
    const result = await this.googleAiService.generateGeminiPro(prompt);
    return result;
  }

  public async convertJDToDTO(userId: string, contentJD: string,): Promise<JobDescriptionDTO> {
    try {
      const json = JSON.parse(contentJD);
      let jobDescription = new JobDescriptionDTO(
        json.JobTitle,
        json.JobObjective,
        json.Education,
        json.Skills,
        json.Experience,
        json.PersonalQualities,
      );
      this.redisService.setObject(userId, jobDescription);
      this.redisService.setObject("User".concat(userId), contentJD);
      return jobDescription;
    } catch (error) {
      throw new Error(`Không thể convert JD to DTO: ${error.message}`);
    }
  }
  public async cleanInputPromt(stringInput: string,): Promise<string> {
    try {
      const required = 'Dựa vào dữ liệu này:'
      + stringInput 
      +' . Hãy thực hiện theo những yêu cầu sau đây:'
      +' 1. Giữ nguyên cấu trúc của dữ liệu nếu là mảng thì giữ nguyên mảng, nếu là object thì giữ nguyên object.'
      +' 2. Giữ nguyên tất cả các trường của dữ liệu đầu vào kể cả mang dữ liệu là [] và null.'
      +' 3. Hãy loại bỏ tất cả các ký hiệu dư thừa ở đầu và ở cuối dữ liệu như : ``` , ```json.'
      +' 4. Tôi chỉ cần dữ liệu trả về và đừng nói gì thêm.'
      const result = await this.googleAiService.generateGeminiPro(required)
      return result;
    } catch (error) {
      throw new Error(`Không thể làm sạch dữ liệu đầu vào: ${error.message}`);
    }
  }

}
