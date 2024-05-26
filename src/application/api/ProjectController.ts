// import {
//     Controller,
//     Get,
//     Post,
//     Body,
//     Param,
//     Patch,
//     Delete,
// } from '@nestjs/common';
// import { ProjectService } from '../services/ProjectService';
// import { Projects } from '../../modules/FireBase/Entity/Projects';
// import { CreateProject } from '../../modules/FireBase/DTO/ProjectsDTO/CreateProject';
// import { UpdateProject } from '../../modules/FireBase/DTO/ProjectsDTO/UpdateProject';
// import { ApiTags } from '@nestjs/swagger';


// @Controller('projects')
// @ApiTags("projects")
// export class ProjectController{
//     constructor(private readonly projectService: ProjectService){}
//     @Get()
//     async getAllProjects(): Promise<Projects[]>{
//         return this.projectService.getAllProjects();
//     }

//     @Get(':id')
//     async getProjectById(@Param('id') id: string): Promise<Projects>{
//         return this.projectService.getProjectById(id);
//     }

//     @Post()
//     async createProject(@Body() createProject: CreateProject): Promise<Projects> {
//         return this.projectService.createProject(createProject);
//     }

//     @Patch(':id')
//     async updateProject(
//         @Param('id') id:string,
//         @Body() updateProject: UpdateProject,): Promise<Projects>{
//             return this.projectService.updateProject(id,updateProject);
//     }

//     @Delete(':id')
//     async deleteProject(@Param('id') id:string):Promise<void>{
//         return this.projectService.deleteProject(id);
//     }
// }