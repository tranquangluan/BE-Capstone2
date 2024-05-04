import { IsOptional } from "class-validator";

export class UpdateExperience{
    @IsOptional()
    date?:string;
    @IsOptional()
    company?:string;
    @IsOptional()
    description?:string[];
    @IsOptional()
    title?:string;
}