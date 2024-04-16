import { IsOptional } from "class-validator";

export class UpdateExperience{
    @IsOptional()
    date?:Date;
    @IsOptional()
    company?:string;
    @IsOptional()
    description?:string[];
    @IsOptional()
    title?:string;
}