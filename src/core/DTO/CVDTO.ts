import { IsString, IsArray, ValidateNested } from 'class-validator';

export class CVDTO {

  @ValidateNested()
  skills: string[];

  @IsString()
  experience: string;

  @ValidateNested()
  personalQualities: string[];

  constructor(
    skills: string[],
    experience: string,
    personalQualities: string[]
  ) {
    this.skills = skills;
    this.experience = experience;
    this.personalQualities = personalQualities;
  }
}