import { Module } from '@nestjs/common';
import { GoogleAiService } from 'src/application/services/GoogleAiService';
import { GoogleAiController } from '../api/GoogleAiController';
import { LanguageService } from 'src/application/services/LanguageService';
import { ResumeService } from 'src/application/services/ResumeService';
import { EducationService } from '../services/EducationService';
import { ProjectService } from '../services/ProjectService';
import { ExperienceService } from '../services/ExperienceService';
import { SkillService } from '../services/SkillService';
import { UserService } from '../services/UserService';
import { MappingService } from '../services/MappingService';
import { RedisModule } from './RedisModule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from '../services/RedisService';

@Module({
  imports: [],
  controllers: [GoogleAiController],
  providers: [
    GoogleAiService,
    LanguageService,
    ResumeService,
    EducationService,
    ProjectService,
    ExperienceService,
    SkillService,
    UserService,
    MappingService,
    ConfigService,
    RedisService
  ],
})
export class GoogleAiModule {}
