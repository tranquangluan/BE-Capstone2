import { Controller, Get, Query, NotFoundException, InternalServerErrorException, Post, Body, Param, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAiService } from 'src/application/services/GoogleAiService';
import { ApiGenerateText, GenerateTextDTO } from '../../core/DTO/GenerateTextDTO';
import { MappingService} from 'src/application/services/MappingService'
import { ApiRewriteText, ReWriteContentDTO } from '../../core/DTO/ReWriteContentDTO';
import { CoreApiResponse, CoreApiResponse1 } from 'src/core/common/api/CoreApiResponse';
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
import { ResumeEducation, ResumeProfile, ResumeProject, ResumeSkills, ResumeWorkExperience, Resumes } from 'src/modules/FireBase/Entity/Resumes';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { JobDescriptionInput, JobDescriptionInputDTO } from 'src/core/DTO/JobDescriptionInputDTO';
import { MappingInput } from 'src/core/DTO/MappingInput';
import { RedisService } from '../services/RedisService';
import { Skills } from 'src/modules/FireBase/Entity/Skills';
import { Experiences } from 'src/modules/FireBase/Entity/Experiences';
import { Projects } from 'src/modules/FireBase/Entity/Projects';

@Controller('AI')
@ApiTags("AI")
export class GoogleAiController {
  constructor(
    private readonly googleAiService: GoogleAiService,
    private readonly mappingService: MappingService,
    private readonly languageService: LanguageService,
    private readonly experienceService: ExperienceService,
    private readonly educationService: EducationService,
    private readonly projectService: ProjectService,
    private readonly skillService: SkillService,
    private readonly redisService: RedisService,
  ) {}

  
  @Post('parseJobDescriptionToDTO')
  @JobDescriptionInput()
  public async generateGeminiPro1(
    @Body() jobDescriptionInputDTO: JobDescriptionInputDTO
  ): Promise<CoreApiResponse<JobDescriptionDTO>> {
    let require =
      'Hãy dựa vào thông tin này hãy rút gọn nội dung và vui lòng cung cấp với các trường có nội dung như sau: {"JobTitle": "Tên của vị trí công việc","JobObjective": "Công việc mà doanh nghiệp mô tả","Educations": "Yêu cầu về học vấn của doanh nghiệp","Skills": "Danh sách kỹ năng cần thiết, datatype là string[]","Experience": "Yêu cầu về kinh nghiệm, datatype là string[]","PersonalQualities": "Các phẩm chất doanh nghiệp mong muốn, datatype là string[]"} với Skills và PersonalQualities được trả về dưới dạng mảng nếu không có dữ liệu thì trả về mảng rỗng, nếu trường nào không có dữ liệu thì mang giá trị null. Dự đoán giá trị của các trường null và trả về giá trị đó';
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


  @Post('mapping')
  @MappingInput()
  public async mappingAPIResumeAndJD(@Body('userId') userId :string,): Promise<CoreApiResponse1<Resumes,JobDescriptionDTO>> {
    const jobDes = await this.redisService.getObject(userId)
    const jobDesString = await this.redisService.getObject("User".concat(userId))
    
    let eduWP = await this.educationService.getEducationById(userId);
    let resultEdu : Education[] = eduWP.data
    const educationToArray : ResumeEducation[] = resultEdu.map(edu=>{
      const { date, degree, school, gpa, descriptions } = edu;
      return { date, degree, school, gpa, descriptions };
    })
    
    let expWP = await this.experienceService.getExperienceById(userId);
    let resultExp : Experiences[] = expWP.data
    const experienceToArray : ResumeWorkExperience[] = resultExp.map(exp=>{
      const { date, company, jobTitle, descriptions } = exp;
      return { date, company, jobTitle, descriptions };
    })
    
    let skillWP = await this.skillService.getSkillById(userId);
    let resultSkill : Skills[] = skillWP.data
    const skillsToArray: ResumeSkills[] = resultSkill.map(skill => {
      const { descriptions} = skill;
      return { featuredSkills: [], descriptions};
    });

    
    let projectWP = await this.projectService.getProjectById(userId);
    let resultProj : Projects[] = projectWP.data
    const projectToArray : ResumeProject[] = resultProj.map(proj=>{
      const { date, descriptions, project } = proj;
      return { date, descriptions, project };
    })
    
    let resume = new ResumeDTO(null,experienceToArray,educationToArray,projectToArray,skillsToArray,null);
    let resumes : Resumes = await this.mappingService.compare(jobDes,resume,userId,jobDesString)
    return CoreApiResponse1.success(resumes, jobDes);
    
  }
}
