import { Controller, Get, Query, NotFoundException, InternalServerErrorException, Post, Body } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAiService } from 'src/application/services/GoogleAiService';
import { ApiGenerateText, GenerateTextDTO } from '../../core/DTO/GenerateTextDTO';
import { TextNormalizationService } from 'src/application/services/TextNormalizationService';
import { MappingService} from 'src/application/services/MappingService'
import { ApiRewriteText, ReWriteContentDTO } from '../../core/DTO/ReWriteContentDTO';
import { CoreApiResponse } from 'src/core/common/api/CoreApiResponse';
import { LanguageService } from 'src/application/services/LanguageService';
import { JobDescriptionDTO } from '../../core/DTO/JobDescriptionDTO';

@Controller('AI')
@ApiTags("AI")
export class GoogleAiController {
  constructor(
    private readonly googleAiService: GoogleAiService,
    private readonly textNormalizationService: TextNormalizationService,
    private readonly mappingService: MappingService,
    private languageService: LanguageService
  ) {}
  
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
    ss
    
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

  @Post('plainText')
  @ApiGenerateText()
  public async processToPlainText(
    @Body('prompt') prompt: string,
  ): Promise<CoreApiResponse<string>> {
    let afterProcessJD = await this.languageService.preProcessJD(prompt);
    return CoreApiResponse.success(afterProcessJD);
  }
  // Begin JD to JSON Object 
  @Post('generateGemini1')
  @ApiGenerateText()
  public async generateGeminiPro1(
    @Body('prompt') prompt: string,
  ): Promise<CoreApiResponse<JobDescriptionDTO>> {
    let require =
      'Hãy dựa vào thông tin này hãy rút gọn nội dung và vui lòng cung cấp với các trường như sau: {"JobTitle": "Tên của vị trí công việc","JobObjective": "Mục tiêu chính của công việc","Skills": "Danh sách kỹ năng cần thiết","Experience": "Yêu cầu về kinh nghiệm","PersonalQualities": "Các phẩm chất doanh nghiệp mong muốn"} với Skills và PersonalQualities được trả về dưới dạng mảng nếu không có dữ liệu thì trả về mảng rỗng, nếu trường nào không có dữ liệu thì mang giá trị null. Dự đoán giá trị của các trường null và trả về giá trị đó';
    let afterProcessJD = await this.languageService.preProcessJD(prompt);
    // return CoreApiResponse.success(afterProcessJD);
    let final = require.concat(afterProcessJD);
    
    try {
      const generatedGeminiProContent = await this.googleAiService.generateGeminiPro(final);
      
      if (typeof generatedGeminiProContent === 'string') {

        const result: JobDescriptionDTO = await this.languageService.convertJDToDTO(generatedGeminiProContent);

        return CoreApiResponse.success(result);
      }
      if (!generatedGeminiProContent) {
        throw new NotFoundException('Unable to generate Gemini Pro content.');
      }
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
  // End JD to JSON Object

  // Begin summary content of a description in capacity profile
  @Post('shortenParagraphs')
  @ApiGenerateText()
  public async generateShort(
    @Body('prompt') prompt: string,
  ): Promise<CoreApiResponse<string>> {
    let require =
      'Hãy dựa vào thông tin này hãy rút gọn nội dung là một đoạn văn để đưa vào CV chuyên nghiệp: ';
    let final = require.concat(prompt);
    try {
      const generatedGeminiProContent =
        await this.googleAiService.generateGeminiPro(final);

      if (!generatedGeminiProContent) {
        throw new NotFoundException('Unable to generate Gemini Pro content.');
      }
      return CoreApiResponse.success(generatedGeminiProContent);
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
  // End summary content of a description in capacity profile

  @Post('detectLanguage')
  @ApiGenerateText()
  public async detectLanguage(@Body('prompt') prompt: string): Promise<string> {
    const result = await this.languageService.detectLanguage(prompt);
    return result;
  }

  // Begin rewrite content from CV
  @Post('rewriteParagraphs')
  @ApiRewriteText()
  public async rewrite(
    @Body() reWriteContentDTO: ReWriteContentDTO
  ): Promise<CoreApiResponse<string>> {
    const result = await this.languageService.rewrite(
      reWriteContentDTO.category,
      reWriteContentDTO.label,
      reWriteContentDTO.content,
    );
    return CoreApiResponse.success(result);
  }
 // End rewrite content from CV
}
