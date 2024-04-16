import { IsOptional } from "class-validator";

export class CreateExperience{
    @IsOptional()
    date?:Date;
    @IsOptional()
    company?:string;
    @IsOptional()
    description?:string[];
    @IsOptional()
    title?:string;
}