import { IsOptional } from "class-validator";

export class UpdateEducation{
    @IsOptional()
    date?:Date;
    @IsOptional()
    degree?:string;
    @IsOptional()
    description?:string[];
    @IsOptional()
    school?:string;
}