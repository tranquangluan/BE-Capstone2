import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';
import { ProjectService } from '../services/ProjectService';
import { Projects } from '../../modules/FireBase/Entity/Projects';
import { CreateProject } from '../../modules/FireBase/DTO/ProjectsDTO/CreateProject';
import { UpdateProject } from '../../modules/FireBase/DTO/ProjectsDTO/UpdateProject';
import { ApiTags } from '@nestjs/swagger';


@Controller('projects')
@ApiTags("projects")
export class ProjectController{
    constructor(private readonly projectService: ProjectService){}
    @Get()
    async getAllEducations(): Promise<Projects[]>{
        return this.projectService.getAllExperiences();
    }

    @Get(':id')
    async getEducationById(@Param('id') id: string): Promise<Projects>{
        return this.projectService.getExperienceById(id);
    }

    @Post()
    async createEducation(@Body() createProject: CreateProject): Promise<Projects> {
        return this.projectService.createExperience(createProject);
    }

    @Patch(':id')
    async updateEducation(
        @Param('id') id:string,
        @Body() updateProject: UpdateProject,): Promise<Projects>{
            return this.projectService.updateExperience(id,updateProject);
    }

    @Delete(':id')
    async deleteEducation(@Param('id') id:string):Promise<void>{
        return this.projectService.deleteExperience(id);
    }
}