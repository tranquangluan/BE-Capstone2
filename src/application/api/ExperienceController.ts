// import {
//     Controller,
//     Get,
//     Post,
//     Body,
//     Param,
//     Patch,
//     Delete,
// } from '@nestjs/common';
// import { Experiences } from '../../modules/FireBase/Entity/Experiences';
// import { ExperienceService } from '../services/ExperienceService';
// import { CreateExperience } from '../../modules/FireBase/DTO/ExperienceDTO/CreateExperience';
// import { UpdateExperience } from '../../modules/FireBase/DTO/ExperienceDTO/UpdateExperience';
// import { ApiTags } from '@nestjs/swagger';

// @Controller('experiences')
// @ApiTags("experiences")
// export class ExperienceController{
//     constructor(private readonly experienceService: ExperienceService){}
//     @Get()
//     async getAllEducations(): Promise<Experiences[]>{
//         return this.experienceService.getAllExperiences();
//     }

//     @Get(':id')
//     async getEducationById(@Param('id') id: string): Promise<Experiences>{
//         return this.experienceService.getExperienceById(id);
//     }

//     @Post()
//     async createEducation(@Body() createEducation: CreateExperience): Promise<Experiences> {
//         return this.experienceService.createExperience(createEducation);
//     }

//     @Patch(':id')
//     async updateEducation(
//         @Param('id') id:string,
//         @Body() updateEducation: UpdateExperience,): Promise<Experiences>{
//             return this.experienceService.updateExperience(id,updateEducation);
//     }

//     @Delete(':id')
//     async deleteEducation(@Param('id') id:string):Promise<void>{
//         return this.experienceService.deleteExperience(id);
//     }
// }