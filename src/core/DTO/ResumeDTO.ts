import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Resume, Settings } from "../../modules/FireBase/Entity/Resumes";
import { ResumeProfile, ResumeWorkExperience, ResumeEducation, ResumeProject, ResumeSkills, ResumeCustom } from '../../modules/FireBase/Entity/Resumes';
export class ResumeDTO {
  @ValidateNested()
  profile: ResumeProfile;
  @ValidateNested()
  workExperiences: ResumeWorkExperience[];
  @ValidateNested()
  educations: ResumeEducation[];
  @ValidateNested()
  projects: ResumeProject[];
  @ValidateNested()
  skills: ResumeSkills;
  @ValidateNested()
  custom: ResumeCustom;
  constructor(
    profile: ResumeProfile,
    workExperiences: ResumeWorkExperience,
    educations: ResumeEducation,
    projects: ResumeProject,
    skills: ResumeSkills,
    custom: ResumeCustom,
  ) {
    this.profile = profile;
    this.workExperiences = [workExperiences];
    this.educations = [educations];
    this.projects = [projects];
    this.skills = skills;
    this.custom = custom;
  }
}