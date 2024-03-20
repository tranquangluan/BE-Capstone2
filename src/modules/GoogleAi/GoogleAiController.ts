import { Controller, Get, Query, NotFoundException, InternalServerErrorException, Post, Body } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { GoogleAiService } from 'src/shares/sevicers/GoogleAiService';
import { ApiGenerateText, GenerateTextDto } from './DTO/GenerateTextDto';



@Controller('googleAi')
export class GoogleAiController {
  constructor(private readonly googleAiService: GoogleAiService) {}

  @Post('generateBase')
  @ApiGenerateText()
  async generate(@Body('prompt') prompt: string): Promise<string> {
    try {
      const generatedText = await this.googleAiService.generateText(prompt);
      if (!generatedText) {
        throw new NotFoundException('Unable to generate text.');
      }
      return generatedText;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  
  @Post('generateGemini')
  @ApiGenerateText()
  public async generateGeminiPro(@Body('prompt') prompt: string): Promise<string> {
    let require = 'Hãy dựa vào thông tin sau hãy rút gọn nội dung và vui lòng cung cấp với các trường như sau: {"JobTitle": "Tên của vị trí công việc","JobObjective": "Mục tiêu chính của công việc","Skills": "Danh sách kỹ năng cần thiết","Experience": "Yêu cầu về kinh nghiệm","PersonalQualities": "Các phẩm chất doanh nghiệp mong muốn"}';
    let final = require.concat(prompt);
    try {
      const generatedGeminiProContent = await this.googleAiService.generateGeminiPro(final);
      console.log(typeof generatedGeminiProContent);
      
      if (!generatedGeminiProContent) {
        throw new NotFoundException('Unable to generate Gemini Pro content.');
      }
      return generatedGeminiProContent;
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

//   @Post('compare')
//   @ApiGenerateText()
//   async compareRSAndJD(@Body('jobDescription') jobDescription: string, @Body('resume') resume: string): Promise<string> {
//     try {
//       // Phân tích Job Description
//       const jobDescriptionAnalysis = await this.googleAiService.generateGeminiPro(jobDescription);
//       if (!jobDescriptionAnalysis) {
//         throw new NotFoundException('Unable to generate analysis for Job Description.');
//       }

//       // Phân tích hồ sơ năng lực
//       const resumeAnalysis = await this.googleAiService.generateGeminiPro(resume);
//       if (!resumeAnalysis) {
//         throw new NotFoundException('Unable to generate analysis for Resume.');
//       }

//       // So sánh và trả về kết quả
//       const comparisonResult = compare(jobDescriptionAnalysis, resumeAnalysis); // Hàm compare là hàm tùy chỉnh của bạn để so sánh và tạo CV dựa trên Job Description và hồ sơ năng lực
//       return comparisonResult;
//     } catch (error) {
//       console.error(error);
//       throw new InternalServerErrorException('Internal server error');
//     }
//   }

//   function compare(jobDescription: string, resume: string): string {
//     // Đoạn code này để xử lý và phân tích các thông tin từ jobDescription và resume
//     // Bạn có thể sử dụng các thuật toán xử lý ngôn ngữ tự nhiên, hoặc các thư viện phân tích văn bản như NLP.js hoặc Natural để phân tích và tìm kiếm thông tin trong văn bản
  
//     // Ví dụ:
//     const jobSkills = extractSkills(jobDescription); // Hàm extractSkills là hàm tùy chỉnh để trích xuất kỹ năng từ Job Description
//     const resumeSkills = extractSkills(resume); // Hàm extractSkills là hàm tùy chỉnh để trích xuất kỹ năng từ hồ sơ năng lực
  
//     // So sánh các kỹ năng
//     const matchedSkills = findMatchingSkills(jobSkills, resumeSkills); // Hàm findMatchingSkills là hàm tùy chỉnh để tìm các kỹ năng giống nhau từ Job Skills và Resume Skills
  
//     // Tạo CV dựa trên kết quả so sánh
//     const generatedCV = generateCV(matchedSkills); // Hàm generateCV là hàm tùy chỉnh để tạo CV dựa trên kỹ năng đã tìm thấy
  
//     return generatedCV;
//   }
  
//   // Ví dụ về các hàm phụ trợ:
  
//   function extractSkills(text: string): string[] {
// }
}
