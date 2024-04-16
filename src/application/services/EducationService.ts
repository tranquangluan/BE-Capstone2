import { Injectable } from "@nestjs/common";
import { Education } from "../../modules/FireBase/Entity/Education";
import * as admin from "firebase-admin";

@Injectable()
export class EducationService{
    async getAllEducations(): Promise<Education[]> {
        const educationCollection = admin.firestore().collection('Education');
        const snapshot = await educationCollection.get();
        const educations: Education[] = [];
        snapshot.forEach((doc) => {
            const education: Education = {
                
                ...doc.data(),
            }as Education;
            educations.push(education);
        });
        return educations;
    }


    async getEducationById(id: string): Promise<Education>{
        const educationDoc = await admin.firestore().collection('Education').doc(id).get();
        if(!educationDoc.exists){
            new Error('Education not found!!!')
        }
        return {
            ...educationDoc.data(),
        }as Education;
    }

    async createEducation(education: Partial<Education>): Promise<Education> {
        const educationCollection = admin.firestore().collection('Education');
        const educationRef = await educationCollection.add(education);
        const createEducation = await educationRef.get();
        return {
        //   id: educationRef.id,
          ...createEducation.data(),
        } as Education;
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
    async updateEducation(id: string, education: Partial<Education>): Promise<Education> {
        const educationDocRef = admin.firestore().collection('Education').doc(id);
        await educationDocRef.update(education);
        const updatedEducation = await educationDocRef.get();
        return{
            // id: updatedEducation.id,
            ...updatedEducation.data(),
        }as Education;
    }

    async deleteEducation(id: string):Promise<void>{
        await admin.firestore().collection('Education').doc(id).delete();
    }
}