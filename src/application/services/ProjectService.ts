import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { Projects } from "../../modules/FireBase/Entity/Projects";
import { CoreApiResponse } from "src/core/common/api/CoreApiResponse";

@Injectable()
export class ProjectService{
    async getAllProjects(): Promise<Projects[]> {
        const projectCollection = admin.firestore().collection('Projects');
        const snapshot = await projectCollection.get();
        const projects: Projects[] = [];
        snapshot.forEach((doc) => {
            const project: Projects = {
                
                ...doc.data(),
            }as Projects;
            projects.push(project);
        });
        return projects;
    }


    async getProjectById(userId: string): Promise<CoreApiResponse<Projects[]>>{
        try{
            const projectDocs = await this.getAllProjects();
            const projects: Projects[] = [];

            for (const projectDoc of projectDocs) {
              if (projectDoc.uid === userId) {
                const project: Projects = {
                  ...projectDoc,
                } as Projects;
                projects.push(project);
              }
            }
        
            if (projects.length === 0) {
              throw new Error('Education not found!!!');
            }
        
            return CoreApiResponse.success(projects);
          } catch (error) {
            return CoreApiResponse.error(500, error.message);
          }
        }

    async createProject(project: Partial<Projects>): Promise<Projects> {
        const projectCollection = admin.firestore().collection('Projects');
        const projectRef = await projectCollection.add(project);
        const createProject = await projectRef.get();
        return {
        //   id: educationRef.id,
          ...createProject.data(),
        } as Projects;
      }
    
    async updateProject(id: string, project: Partial<Projects>): Promise<Projects> {
        const projectDocRef = admin.firestore().collection('Projects').doc(id);
        await projectDocRef.update(project);
        const updatedExperience = await projectDocRef.get();
        return{
            // id: updatedEducation.id,
            ...updatedExperience.data(),
        }as Projects;
    }

    async deleteProject(id: string):Promise<void>{
        await admin.firestore().collection('Projects').doc(id).delete();
    }
}