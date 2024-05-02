import { IsOptional } from "class-validator";
import { Resume } from "../../Entity/Resumes";

export class CreateResume{
    @IsOptional()
    Resume?: Resume;
}