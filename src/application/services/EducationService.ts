import { Injectable } from "@nestjs/common";
import { Education } from "../../modules/FireBase/Entity/Education";
import { CoreApiResponse } from 'src/core/common/api/CoreApiResponse';
import * as admin from "firebase-admin";

@Injectable()
export class EducationService{
    async getAllEducations(): Promise<Education[]> {
        try{
            const educationCollection = admin.firestore().collection('Education');
            const snapshot = await educationCollection.get();
            const educations: Education[] = [];
            snapshot.forEach((doc) => {
            const education: Education = {
                
                ...doc.data(),
            }as Education;
            educations.push(education);
        });
        if (educations.length === 0) {
          throw new Error('Education not found in firebase!!!');
        }
        return educations;
        }catch(error){
            return error.message;
        }
    }


    async getEducationById(userId: string): Promise<CoreApiResponse<Education[]>>{
        try{
            const educationDocs = await this.getAllEducations();
            const educations: Education[] = [];

            for (const educationDoc of educationDocs) {
              if (educationDoc.uid === userId) {
                const education: Education = {
                  ...educationDoc,
                } as Education;
                educations.push(education);
              }
            }
        
            if (educations.length === 0) {
              throw new Error('This User do not have any Education!!!');
            }
        
            return CoreApiResponse.success(educations);
          } catch (error) {
            return CoreApiResponse.error(500, error.message);
          }
    }

    async createEducation(education: Partial<Education>): Promise<CoreApiResponse<Education>> {
        try{
            const educationCollection = admin.firestore().collection('Education');
            const educationRef = await educationCollection.add(education);
            const createEducation = await educationRef.get();
            const educationData:Education = {
            //   id: educationRef.id,
              ...createEducation.data(),
            } as Education;
            return CoreApiResponse.success(educationData);
        }catch(error){
            return CoreApiResponse.error(500, error.message);
        }
        
    }
   
    async updateEducation(id: string, education: Partial<Education>): Promise<CoreApiResponse<Education>> {
        try{
            const educationDocRef = admin.firestore().collection('Education').doc(id);
        await educationDocRef.update(education);
        const updatedEducation = await educationDocRef.get();
        const educationData:Education = {
            // id: updatedEducation.id,
            ...updatedEducation.data(),
        }as Education;
        return CoreApiResponse.success(educationData  );
        }catch(error){
            return CoreApiResponse.error(500, error.message);
        }
        
    }

    async deleteEducation(id: string):Promise<void>{
        await admin.firestore().collection('Education').doc(id).delete();
    }
}