// src/dtos/check-string.dto.ts

import { IsString, ValidateNested } from 'class-validator';

export class JobDescriptionDTO {
  @IsString()
  jobTitle: string;

  @IsString()
  jobObjective: string;

  @IsString()
  educations: string[];

  @ValidateNested()
  skills: string[];

  @IsString()
  experience: string;

  @ValidateNested()
  personalQualities: string[];

  constructor(
    jobTitle: string,
    jobObjective: string,
    educations: string[],
    skills: string[],
    experience: string,
    personalQualities: string[]
  ) {
    this.jobTitle = jobTitle;
    this.jobObjective = jobObjective;
    this.educations = educations;
    this.skills = skills;
    this.experience = experience;
    this.personalQualities = personalQualities;
  }
}
