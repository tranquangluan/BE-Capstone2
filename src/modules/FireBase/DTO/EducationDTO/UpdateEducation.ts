import { IsOptional } from "class-validator";

export class UpdateEducation{
    @IsOptional()
    date?:string;
    @IsOptional()
    degree?:string;
    @IsOptional()
    description?:string[];
    @IsOptional()
    school?:string;
}