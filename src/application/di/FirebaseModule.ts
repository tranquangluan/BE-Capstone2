import { Module } from '@nestjs/common';
import { EducationService } from '../services/EducationService';
import { ExperienceService } from '../services/ExperienceService';
import { ProjectService } from '../services/ProjectService';
import { EducationController } from '../api/EducationController';
import { ExperienceController } from '../api/ExperienceController';
import { ProjectController } from '../api/ProjectController';

@Module({
  imports: [],
  controllers: [EducationController, ExperienceController, ProjectController],
  providers: [EducationService, ExperienceService , ProjectService ],
})
export class FirebaseModule {}
