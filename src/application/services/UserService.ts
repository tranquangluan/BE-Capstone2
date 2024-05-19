import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { Resumes } from "../../modules/FireBase/Entity/Resumes";

@Injectable()
export class UserService{
    async getAllUsers(): Promise<Resumes[]> {
        const experienceCollection = admin.firestore().collection('Users');
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


    async getUserById(id: string): Promise<Resumes>{
        const experienceDoc = await admin.firestore().collection('Users').doc(id).get();
        if(!experienceDoc.exists){
            new Error('Experience not found!!!')
        }
        return {
            ...experienceDoc.data(),
        }as Resumes;
    }

    async createUser(experience: Partial<Resumes>): Promise<Resumes> {
        const experienceCollection = admin.firestore().collection('Users');
        const experienceRef = await experienceCollection.add(experience);
        const createExperience = await experienceRef.get();
        return {
        //   id: educationRef.id,
          ...createExperience.data(),
        } as Resumes;
      }
    
    async updateUser(id: string, experience: Partial<Resumes>): Promise<Resumes> {
        const experienceDocRef = admin.firestore().collection('Users').doc(id);
        await experienceDocRef.update(experience);
        const updatedExperience = await experienceDocRef.get();
        return{
            // id: updatedEducation.id,
            ...updatedExperience.data(),
        }as Resumes;
    }

    async deleteUser(id: string):Promise<void>{
        await admin.firestore().collection('Users').doc(id).delete();
    }
}