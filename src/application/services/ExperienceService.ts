import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { Experiences } from "../../modules/FireBase/Entity/Experiences";
import { CoreApiResponse } from "src/core/common/api/CoreApiResponse";

@Injectable()
export class ExperienceService{
    async getAllExperiences(): Promise<Experiences[]> {
        const experienceCollection = admin.firestore().collection('Experiences');
        const snapshot = await experienceCollection.get();
        const experiences: Experiences[] = [];
        snapshot.forEach((doc) => {
            const experience: Experiences = {
                
                ...doc.data(),
            }as Experiences;
            experiences.push(experience);
        });
        return experiences;
    }


    async getExperienceById(id: string): Promise<CoreApiResponse<Experiences>>{

        try{
            const experienceDoc = await admin.firestore().collection('Experiences').doc(id).get();
            if(!experienceDoc.exists){
                new Error('Experience not found!!!')
            }
            const experience : Experiences =  {
                ...experienceDoc.data(),
            }as Experiences;
            return CoreApiResponse.success(experience);
        }catch(error){
            return CoreApiResponse.error(500, error.message);
        }
    }

    async createExperience(experience: Partial<Experiences>): Promise<Experiences> {
        const experienceCollection = admin.firestore().collection('Experiences');
        const experienceRef = await experienceCollection.add(experience);
        const createExperience = await experienceRef.get();
        return {
        //   id: educationRef.id,
          ...createExperience.data(),
        } as Experiences;
      }
    
    async updateExperience(id: string, experience: Partial<Experiences>): Promise<Experiences> {
        const experienceDocRef = admin.firestore().collection('Experiences').doc(id);
        await experienceDocRef.update(experience);
        const updatedExperience = await experienceDocRef.get();
        return{
            // id: updatedEducation.id,
            ...updatedExperience.data(),
        }as Experiences;
    }

    async deleteExperience(id: string):Promise<void>{
        await admin.firestore().collection('Experiences').doc(id).delete();
    }
}