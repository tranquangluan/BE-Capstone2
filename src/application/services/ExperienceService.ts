import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { Experiences } from "../../modules/FireBase/Entity/Experiences";

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


    async getExperienceById(id: string): Promise<Experiences>{
        const experienceDoc = await admin.firestore().collection('Experiences').doc(id).get();
        if(!experienceDoc.exists){
            new Error('Experience not found!!!')
        }
        return {
            ...experienceDoc.data(),
        }as Experiences;
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
    // async createEducation(education: Partial<Education>): Promise<Education> {
    //     const educationDocRef = admin.firestore().collection('Education').doc();
    //     await educationDocRef.set(education);
    //     const createEducation = await educationDocRef.get();
    //     return {
    //     //   id: createEducation.id,
    //       ...createEducation.data(),
    //     } as Education;
    //   }
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