import { Module } from '@nestjs/common';
import { EducationService } from '../services/EducationService';
import { ExperienceService } from '../services/ExperienceService';
import { ProjectService } from '../services/ProjectService';

@Module({
  imports: [],
  controllers: [],
  providers: [EducationService, ExperienceService, ProjectService,],
})
export class FirebaseModule {}
