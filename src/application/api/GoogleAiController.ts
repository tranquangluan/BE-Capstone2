import { Controller, Get, Query, NotFoundException, InternalServerErrorException, Post, Body, Param, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAiService } from 'src/application/services/GoogleAiService';
import { ApiGenerateText, GenerateTextDTO } from '../../core/DTO/GenerateTextDTO';
// import { MappingService} from 'src/application/services/MappingService'
import { ApiRewriteText, ReWriteContentDTO } from '../../core/DTO/ReWriteContentDTO';
import { CoreApiResponse } from 'src/core/common/api/CoreApiResponse';
import { LanguageService } from 'src/application/services/LanguageService';
import { JobDescriptionDTO } from '../../core/DTO/JobDescriptionDTO';
import { ResumeService } from '../services/ResumeService';
import { ResumeDTO } from 'src/core/DTO/ResumeDTO';
import { ExperienceService } from '../services/ExperienceService';
import { EducationService } from '../services/EducationService';
import { ProjectService } from '../services/ProjectService';
import { SkillService } from '../services/SkillService';
import { UserService } from '../services/UserService';
import { log } from 'console';
import { Education } from 'src/modules/FireBase/Entity/Education';
import { CVDTO } from 'src/core/DTO/CVDTO';
import { ResumeEducation, ResumeProfile, ResumeProject, ResumeSkills, ResumeWorkExperience, resumes } from 'src/modules/FireBase/Entity/Resumes';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { JobDescriptionInput, JobDescriptionInputDTO } from 'src/core/DTO/JobDescriptionInputDTO';
import { MappingService } from '../services/MappingService';

@Controller('AI')
@ApiTags("AI")
export class GoogleAiController {
  constructor(
    private readonly googleAiService: GoogleAiService,
    private readonly mappingService: MappingService,
    private readonly languageService: LanguageService,
    private readonly resumeService: ResumeService,
    private readonly experienceService: ExperienceService,
    private readonly educationService: EducationService,
    private readonly projectService: ProjectService,
    private readonly skillService: SkillService,
    private readonly userService: UserService,
  ) {}

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

  // @Post('compare')
  // @ApiGenerateText()
  // async compareRSAndJD(@Body('jobDescription') jobDescription: string, @Body('resume') resume: string): Promise<string> {
  //   try {
  //     // Phân tích Job Description
  //     const jobDescriptionAnalysis = await this.googleAiService.generateGeminiPro(jobDescription);
  //     if (!jobDescriptionAnalysis) {
  //       throw new NotFoundException('Unable to generate analysis for Job Description.');
  //     }

  //     // Phân tích hồ sơ năng lực
  //     const resumeAnalysis = await this.googleAiService.generateGeminiPro(resume);
  //     if (!resumeAnalysis) {
  //       throw new NotFoundException('Unable to generate analysis for Resume.');
  //     }

  //     // So sánh và trả về kết quả
  //     const comparisonResult = this.mappingService.compare(jobDescriptionAnalysis, resumeAnalysis); // Hàm compare là hàm tùy chỉnh của bạn để so sánh và tạo CV dựa trên Job Description và hồ sơ năng lực
  //     return comparisonResult;
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException('Internal server error');
  //   }
  // }

  @Post('plainText')
  @ApiGenerateText()
  public async processToPlainText(@Body('prompt') prompt: string): Promise<CoreApiResponse<string>> {
    let afterProcessJD = await this.languageService.preProcessJD(prompt);
    return CoreApiResponse.success(afterProcessJD);
  }
  @Post('generateGemini1')
  @JobDescriptionInput()
  public async generateGeminiPro1(
    @Body() jobDescriptionInputDTO: JobDescriptionInputDTO
  ): Promise<CoreApiResponse<JobDescriptionDTO>> {
    let require =
      'Hãy dựa vào thông tin này hãy rút gọn nội dung và vui lòng cung cấp với các trường như sau: {"JobTitle": "Tên của vị trí công việc","JobObjective": "Mục tiêu chính của công việc","Skills": "Danh sách kỹ năng cần thiết","Experience": "Yêu cầu về kinh nghiệm","PersonalQualities": "Các phẩm chất doanh nghiệp mong muốn"} với Skills và PersonalQualities được trả về dưới dạng mảng nếu không có dữ liệu thì trả về mảng rỗng, nếu trường nào không có dữ liệu thì mang giá trị null. Dự đoán giá trị của các trường null và trả về giá trị đó';
    let afterProcessJD = await this.languageService.preProcessJD(jobDescriptionInputDTO.jobDescription);
    let final = require.concat(afterProcessJD);
    try {
      const generatedGeminiProContent = await this.googleAiService.generateGeminiPro(final);
      if (typeof generatedGeminiProContent === 'string') {
        const result: JobDescriptionDTO = await this.languageService.convertJDToDTO(jobDescriptionInputDTO.userId, generatedGeminiProContent);
        return CoreApiResponse.success(result);
      }
      if (!generatedGeminiProContent) {
        throw new NotFoundException('Unable to generate Gemini Pro content.');
      }
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }


  @Post('partResumeDTO')
  @ApiGenerateText()
  public async generate(@Body('prompt') prompt: string): Promise<CoreApiResponse<JobDescriptionDTO>> {
    // let require ='Hãy dựa vào thông tin này hãy rút gọn nội dung và vui lòng cung cấp với các trường như sau: {"JobTitle": "Tên của vị trí công việc","JobObjective": "Mục tiêu chính của công việc","Skills": "Danh sách kỹ năng cần thiết","Experience": "Yêu cầu về kinh nghiệm","PersonalQualities": "Các phẩm chất doanh nghiệp mong muốn"} với Skills và PersonalQualities được trả về dưới dạng mảng nếu không có dữ liệu thì trả về mảng rỗng, nếu trường nào không có dữ liệu thì mang giá trị null. Dự đoán giá trị của các trường null và trả về giá trị đó';
    let require ='Hãy dựa vào thông tin sau hãy rút gọn nội dung và vui lòng cung cấp với các trường như sau: {\"JobTitle\": \"Tên của vị trí công việc\",\"JobObjective\": \"Mục tiêu chính của công việc\",\"Skills\": \"Danh sách kỹ năng cần thiết\",\"Experiences\": \"Yêu cầu về kinh nghiệm\",\"PersonalQualities\": \"Các phẩm chất doanh nghiệp mong muốn\"}';
    let afterProcessJD = await this.languageService.preProcessJD(prompt);
    let final = require.concat(afterProcessJD);
    try {
      const generatedGeminiProContent = await this.googleAiService.generateGeminiPro(final);
      if (typeof generatedGeminiProContent === 'string') {
        const result: JobDescriptionDTO = await this.languageService.convertJDToDTO("1",generatedGeminiProContent);
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
      const generatedGeminiProContent = await this.googleAiService.generateGeminiPro(final);
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
  @Post('rewriteParagraphs')
  @ApiRewriteText()
  public async rewrite(@Body() reWriteContentDTO: ReWriteContentDTO): Promise<CoreApiResponse<string>> {
    const result = await this.languageService.rewrite(
      reWriteContentDTO.userId,
      reWriteContentDTO.category,
      reWriteContentDTO.label,
      reWriteContentDTO.content,
    );
    return CoreApiResponse.success(result);
  }

  @Get('mappinggggg/:id')
  // @ApiGenerateText()
  public async mappingAPIResumeAndJD(@Param('id') userId :string,): Promise<ResumeDTO> {
    // thông tin hồ sơ năng lực
    let eduWP = await this.educationService.getEducationById(userId);
    let resumeEducation: ResumeEducation = {
      school: eduWP.data.school,
      degree: eduWP.data.degree,
      date: eduWP.data.date,
      gpa: eduWP.data.gpa,
      descriptions: eduWP.data.description,
    };
    let expWP = await this.experienceService.getExperienceById(userId);
    let resumeExperience: ResumeWorkExperience = {
      company: expWP.company,
      jobTitle: expWP.jobTitle,
      date: expWP.date,
      descriptions: expWP.description,
    };
    let skillWP = await this.skillService.getSkillById(userId);
    let resumeSkill: ResumeSkills = {
      featuredSkills: [],
      descriptions: skillWP.description,
    };
    let projectWP = await this.projectService.getProjectById(userId);
    let resumeProject: ResumeProject={
      project: projectWP.name,
      date: projectWP.date,
      descriptions: projectWP.description,
    };
    let userWP = await this.userService.getUserById(userId);
    // let resumeProfile = await this.userService.getUserById(userId);
    // let resumeProfile: ResumeProfile={
    //   name: userWP.,
    //   email: userWP.,
    //   phone: userWP.,
    //   url: userWP.,
    //   summary: userWP.,
    //   location: userWP.,
    // };
    // let resume = new ResumeDTO();
    
    // thông tin jobdescription
    
  return null;
    // gọi service mapping
    // const resume1:resumes = this.languageService.compare()
  }

}
