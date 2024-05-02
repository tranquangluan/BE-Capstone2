import { IsOptional } from "class-validator";
import { Resume } from "../../Entity/Resumes";
import { Settings } from "../../Entity/Resumes";

export class UpdateResume{
    @IsOptional()
    Resume?:Resume;
    @IsOptional()
    Settings?:Settings;
}