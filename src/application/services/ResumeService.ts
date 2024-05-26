import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { Resumes } from "../../modules/FireBase/Entity/Resumes";

@Injectable()
export class ResumeService{
    async getAllResumes(): Promise<Resumes[]> {
        const experienceCollection = admin.firestore().collection('resumes');
        const snapshot = await experienceCollection.get();
        const experiences: Resumes[] = [];
        snapshot.forEach((doc) => {
            const experience: Resumes = {
                
                ...doc.data(),
            }as Resumes;
            experiences.push(experience);
        });
        return experiences;
    }


    async getResumeById(id: string): Promise<Resumes>{
        const experienceDoc = await admin.firestore().collection('resumes').doc(id).get();
        if(!experienceDoc.exists){
            new Error('Experience not found!!!')
        }
        return {
            ...experienceDoc.data(),
        }as Resumes;
    }

    async createResume(experience: Partial<Resumes>): Promise<Resumes> {
        const experienceCollection = admin.firestore().collection('resumes');
        const experienceRef = await experienceCollection.add(experience);
        const createExperience = await experienceRef.get();
        return {
          ...createExperience.data(),
        } as Resumes;
      }
    
    async updateResume(id: string, experience: Partial<Resumes>): Promise<Resumes> {
        const experienceDocRef = admin.firestore().collection('resumes').doc(id);
        await experienceDocRef.update(experience);
        const updatedExperience = await experienceDocRef.get();
        return{
            ...updatedExperience.data(),
        }as Resumes;
    }

    async deleteResume(id: string):Promise<void>{
        await admin.firestore().collection('resumes').doc(id).delete();
    }
}