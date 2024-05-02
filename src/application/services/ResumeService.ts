import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { resumes } from "../../modules/FireBase/Entity/Resumes";

@Injectable()
export class ResumeService{
    async getAllResumes(): Promise<resumes[]> {
        const experienceCollection = admin.firestore().collection('resumes');
        const snapshot = await experienceCollection.get();
        const experiences: resumes[] = [];
        snapshot.forEach((doc) => {
            const experience: resumes = {
                
                ...doc.data(),
            }as resumes;
            experiences.push(experience);
        });
        return experiences;
    }


    async getResumeById(id: string): Promise<resumes>{
        const experienceDoc = await admin.firestore().collection('resumes').doc(id).get();
        if(!experienceDoc.exists){
            new Error('Experience not found!!!')
        }
        return {
            ...experienceDoc.data(),
        }as resumes;
    }

    async createResume(experience: Partial<resumes>): Promise<resumes> {
        const experienceCollection = admin.firestore().collection('resumes');
        const experienceRef = await experienceCollection.add(experience);
        const createExperience = await experienceRef.get();
        return {
        //   id: educationRef.id,
          ...createExperience.data(),
        } as resumes;
      }
    
    async updateResume(id: string, experience: Partial<resumes>): Promise<resumes> {
        const experienceDocRef = admin.firestore().collection('resumes').doc(id);
        await experienceDocRef.update(experience);
        const updatedExperience = await experienceDocRef.get();
        return{
            // id: updatedEducation.id,
            ...updatedExperience.data(),
        }as resumes;
    }

    async deleteResume(id: string):Promise<void>{
        await admin.firestore().collection('resumes').doc(id).delete();
    }
}