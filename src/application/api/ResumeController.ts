// import {
//     Controller,
//     Get,
//     Post,
//     Body,
//     Param,
//     Patch,
//     Delete,
// } from '@nestjs/common';
// import { ResumeService } from '../services/ResumeService';
// import { Resumes } from '../../modules/FireBase/Entity/resumes';
// import { CreateResume } from '../../modules/FireBase/DTO/ResumesDTO/CreateResume';
// import { UpdateResume } from '../../modules/FireBase/DTO/ResumesDTO/UpdateResume';
// import { ApiTags } from '@nestjs/swagger';

// @Controller('resumes')
// @ApiTags("resumes")
// export class ResumeController{
//     constructor(private readonly resumeService: ResumeService){}
//     @Get()
//     async getAllResumes(): Promise<Resumes[]>{
//         return this.resumeService.getAllResumes();
//     }

//     @Get(':id')
//     async getResumeById(@Param('id') id: string): Promise<Resumes>{
//         return this.resumeService.getResumeById(id);
//     }

//     @Post()
//     async createResume(@Body() createResume: CreateResume): Promise<Resumes> {
//         return this.resumeService.createResume(createResume);
//     }

//     @Patch(':id')
//     async updateResume(
//         @Param('id') id:string,
//         @Body() updateResume: UpdateResume,): Promise<Resumes>{
//             return this.resumeService.updateResume(id,updateResume);
//     }

//     @Delete(':id')
//     async deleteEducation(@Param('id') id:string):Promise<void>{
//         return this.resumeService.deleteResume(id);
//     }

    
// }