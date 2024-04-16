import { IsOptional } from "class-validator";

export class CreateEducation{
    @IsOptional()
    date?:Date;
    @IsOptional()
    degree?:string;
    @IsOptional()
    description?:string[];
    @IsOptional()
    school?:string;
}