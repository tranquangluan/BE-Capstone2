import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { Skills } from "../../modules/FireBase/Entity/Skills";
import { CoreApiResponse } from "src/core/common/api/CoreApiResponse";

@Injectable()
export class SkillService{
    async getAllSkills(): Promise<Skills[]> {
        const skillCollection = admin.firestore().collection('Skills');
        const snapshot = await skillCollection.get();
        const skills: Skills[] = [];
        snapshot.forEach((doc) => {
            const skill: Skills = {
                
                ...doc.data(),
            }as Skills;
            skills.push(skill);
        });
        return skills;
    }


    async getSkillById(userId: string): Promise<CoreApiResponse<Skills[]>>{
        try{
            const skillDocs = await this.getAllSkills();
            const skills: Skills[] = [];

            for (const skillDoc of skillDocs) {
              if (skillDoc.uid === userId) {
                const skill: Skills = {
                  ...skillDoc,
                } as Skills;
                skills.push(skill);
              }
            }
        
            if (skills.length === 0) {
              throw new Error('Education not found!!!');
            }
        
            return CoreApiResponse.success(skills);
          } catch (error) {
            return CoreApiResponse.error(500, error.message);
          }
        }

    async createSkill(skill: Partial<Skills>): Promise<Skills> {
        const skillCollection = admin.firestore().collection('Skills');
        const skillRef = await skillCollection.add(skill);
        const createSkill = await skillRef.get();
        return {
        //   id: educationRef.id,
          ...createSkill.data(),
        } as Skills;
      }
    
    async updateSkill(id: string, skill: Partial<Skills>): Promise<Skills> {
        const skillDocRef = admin.firestore().collection('Skills').doc(id);
        await skillDocRef.update(skill);
        const updatedSkill = await skillDocRef.get();
        return{
            // id: updatedEducation.id,
            ...updatedSkill.data(),
        }as Skills;
    }

    async deleteSkill(id: string):Promise<void>{
        await admin.firestore().collection('Skills').doc(id).delete();
    }
}