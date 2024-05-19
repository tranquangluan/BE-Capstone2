import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { EducationService } from '../services/EducationService';
import { Education } from '../../modules/FireBase/Entity/Education';
import { CreateEducation } from '../../modules/FireBase/DTO/EducationDTO/CreateEducation';
import { UpdateEducation } from '../../modules/FireBase/DTO/EducationDTO/UpdateEducation';
import { ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/core/common/api/CoreApiResponse';

@Controller('educations')
@ApiTags("educations")
export class EducationController{
    constructor(private readonly educationService: EducationService){}
    @Get()
    async getAllEducations(): Promise<CoreApiResponse<Education[]>>{
        return this.educationService.getAllEducations();
    }

    @Get(':id')
    async getEducationById(@Param('id') id: string): Promise<CoreApiResponse<Education>>{
        return this.educationService.getEducationById(id);
    }
    // @Get(':id')
    // async getEducationById(@Param('id') id: string): Promise<Education>{
    //     return this.educationService.getEducationById(id);
    // }

    @Post()
    async createEducation(@Body() createEducation: CreateEducation): Promise<CoreApiResponse<Education>> {
        return this.educationService.createEducation(createEducation);
    }

    @Patch(':id')
    async updateEducation(
        @Param('id') id:string,
        @Body() updateEducation: UpdateEducation,): Promise<CoreApiResponse<Education>>{
            return this.educationService.updateEducation(id,updateEducation);
    }

    @Delete(':id')
    async deleteEducation(@Param('id') id:string):Promise<void>{
        return this.educationService.deleteEducation(id);
    }
}