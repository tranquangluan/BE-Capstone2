import {Entity, PrimaryGeneratedColumn , Column, Double} from 'typeorm';

@Entity()
export class Resumes{
  @Column({name:'Resume'})
  Resume: Resume;
  @Column({name:'Settings'})
  Settings: Settings | null;
  @Column({name:'uid', nullable:false})
  uid: string;
  
  constructor(
    Resume: Resume, 
    Settings: Settings | null = null 
  ) {
    this.Resume = Resume;
    this.Settings = Settings;
  };
  // constructor(
  //   Resume: Resume,
  
  // ) {
  //   this.Resume = Resume;
    
  // }
}


export interface ResumeProfile {
    name: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: string;
  }
  
  export interface ResumeWorkExperience {
    company: string;
    jobTitle: string;
    date: string;
    descriptions: string[];
  }
  
  export interface ResumeEducation {
    school: string;
    degree: string;
    date: string;
    gpa: string;
    descriptions: string[];
  }
  
  export interface ResumeProject {
    project: string;
    date: string;
    descriptions: string[];
  }
  
  export interface FeaturedSkill {
    skill: string;
    rating: number;
  }
  
  export interface ResumeSkills {
    featuredSkills: FeaturedSkill[];
    descriptions: string[];
  }
  
  export interface ResumeCustom {
    descriptions: string[];
  }
  
  export interface Resume {
    profile: ResumeProfile;
    workExperiences: ResumeWorkExperience[];
    educations: ResumeEducation;
    projects: ResumeProject[];
    skills: ResumeSkills;
    custom: ResumeCustom;
  }

  export interface Settings {
    themeColor: string;
    fontFamily: string;
    fontSize: string;
    documentSize: string;
    formToShow: {
      workExperiences: boolean;
      educations: boolean;
      projects: boolean;
      skills: boolean;
      custom: boolean;
    };
    formToHeading: {
      workExperiences: string;
      educations: string;
      projects: string;
      skills: string;
      custom: string;
    };
    formsOrder: ShowForm[];
    showBulletPoints: {
      workExperiences: boolean;
      educations: boolean;
      projects: boolean;
      skills: boolean;
      custom: boolean;
    };
  }
  
  export type ResumeKey = keyof Resume;
  export type ShowForm = keyof Settings["formToShow"];
