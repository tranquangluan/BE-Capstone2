import { Controller, Get, Query, NotFoundException, InternalServerErrorException, Post, Body } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { GoogleAiService } from 'src/shares/sevicers/GoogleAiService';
import { ApiGenerateText, GenerateTextDto } from './DTO/GenerateTextDto';
import { TextNormalizationService } from 'src/shares/sevicers/TextNormalizationService';
import { MappingService} from 'src/shares/sevicers/MappingService'

@Controller('googleAi')
export class GoogleAiController {
  constructor(
    private readonly googleAiService: GoogleAiService,
    private readonly textNormalizationService: TextNormalizationService,
    private readonly mappingService: MappingService,
  ) {}
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

  
  @Post('generateJobDescription')
  @ApiGenerateText()
  public async generateGeminiPro(@Body('prompt') prompt: string): Promise<string> {
    prompt = `Mô tả công việc:
    ● Chịu trách nhiệm nghiên cứu & phát triển backend sử dụng ngôn ngữ/công nghệ: Java, MySQL, Redis, Memcached, Kafka, ElasticSearch, Docker, K8S,...
    
    ● Thiết kế/lập trình các module, thiết kế giao tiếp cho hệ thống tải lớn hàng trăm triệu người dùng (sử dụng cả Java).
    
    ● Nghiên cứu sử dụng, chỉnh sửa các open source về VoIP, streaming phổ biến.
    
    ● Chi tiết sẽ trao đổi cụ thể khi phỏng vấn.
    
    Yêu cầu ứng viên
    ● Thành thạo Java.
    
    ● Nắm rất vững lập trình hướng đối tượng, Design Pattern.
    
    ● Có kinh nghiệm về unit test và integration test.
    
    ● Hiểu về lập trình đa luồng, non-blocking IO, xử lý bất đồng bộ,...
    
    ● Đã từng làm việc với Socket, TCP/IP, các thư viện như SpringBoot, Netty, Apache MINA là lợi thế.
    
    ● Đã từng làm việc với RabbitMQ, ActiveMQ, Kafka, Docker, K8S,... là lợi thế.
    
    ● Có khả năng làm việc với Linux.
    
    ● CV bằng tiếng Việt hoặc tiếng Anh.
    
    ● Hạn nộp hồ sơ: trước ngày 15 tháng 4 năm 2024.`;
    let NormalizationPrompt = this.textNormalizationService.normalizeText(prompt);
    // let require = 'Hãy dựa vào thông tin sau hãy rút gọn nội dung và vui lòng cung cấp với các trường như sau: {"JobTitle": "Tên của vị trí công việc","JobObjective": "Mục tiêu chính của công việc","Skills": "Danh sách kỹ năng cần thiết","Experience": "Yêu cầu về kinh nghiệm","PersonalQualities": "Các phẩm chất doanh nghiệp mong muốn"}';
    let require = 'Hãy dựa vào thông tin sau hãy rút gọn nội dung và vui lòng cung cấp với các trường như sau: {\"JobTitle\": \"Tên của vị trí công việc\",\"JobObjective\": \"Mục tiêu chính của công việc\",\"Skills\": \"Danh sách kỹ năng cần thiết\",\"Experiences\": \"Yêu cầu về kinh nghiệm\",\"PersonalQualities\": \"Các phẩm chất doanh nghiệp mong muốn\"}';
    let final = require.concat(NormalizationPrompt);
    try {
      const generatedGeminiProContent = await this.googleAiService.generateGeminiPro(final);
      console.log(NormalizationPrompt);
      
      if (!generatedGeminiProContent) {
        throw new NotFoundException('Unable to generate Gemini Pro content.');
      }
      return generatedGeminiProContent;
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Post('rewriteContent')
  @ApiGenerateText()
  public async rewriteContent(@Body('prompt') prompt: string): Promise<string> {
    let require = 'Hãy viết lại câu kèm theo văn phong với nội dung ngắn gọn và xúc tích để thêm vào cv, lấy dữ liệu xâu vào trọng tâm và lượt bỏ giải thích dài dòng.';
    let final = require.concat(prompt);
    try {
      const generatedGeminiProContent = await this.googleAiService.generateGeminiPro(final);
    
      
      if (!generatedGeminiProContent) {
        throw new NotFoundException('Unable to generate Gemini Pro content.');
      }
      return generatedGeminiProContent;
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  
  @Post('compare')
  @ApiGenerateText()
  async compareRSAndJD(@Body('jobDescription') jobDescription: string, @Body('resume') resume: string): Promise<string> {
    try {
      // Phân tích Job Description
      const jobDescriptionAnalysis = await this.googleAiService.generateGeminiPro(jobDescription);
      if (!jobDescriptionAnalysis) {
        throw new NotFoundException('Unable to generate analysis for Job Description.');
      }

      // Phân tích hồ sơ năng lực
      const resumeAnalysis = await this.googleAiService.generateGeminiPro(resume);
      if (!resumeAnalysis) {
        throw new NotFoundException('Unable to generate analysis for Resume.');
      }

      // So sánh và trả về kết quả
      const comparisonResult = this.mappingService.compare(jobDescriptionAnalysis, resumeAnalysis); // Hàm compare là hàm tùy chỉnh của bạn để so sánh và tạo CV dựa trên Job Description và hồ sơ năng lực
      return comparisonResult;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  
}
