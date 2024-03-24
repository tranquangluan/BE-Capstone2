export class CVResponseDto {
    readonly status: string;
    readonly data: CVDataDto;
  
    constructor(status: string, data: CVDataDto) {
      this.status = status;
      this.data = data;
    }
  }
  
  export class CVDataDto {
    readonly experiences: string[];
    readonly personalqualities: string[];
    readonly skills: string[];
  
    constructor(experiences: string[], personalqualities: string[], skills: string[]) {
      this.experiences = experiences;
      this.personalqualities = personalqualities;
      this.skills = skills;
    }
  }