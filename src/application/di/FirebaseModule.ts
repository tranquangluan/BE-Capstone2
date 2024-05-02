import { Module } from '@nestjs/common';
import { EducationService } from '../services/EducationService';
import { ExperienceService } from '../services/ExperienceService';
import { ProjectService } from '../services/ProjectService';
import { EducationController } from '../api/EducationController';
import { ExperienceController } from '../api/ExperienceController';
import { ProjectController } from '../api/ProjectController';
import { ResumeService } from '../services/ResumeService';
import { ResumeController } from '../api/ResumeController';

@Module({
  imports: [],
  controllers: [EducationController, ExperienceController, ProjectController, ResumeController],
  providers: [EducationService, ExperienceService , ProjectService, ResumeService],
})
export class FirebaseModule {}
