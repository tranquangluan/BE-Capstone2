import { IsOptional } from "class-validator";

export class CreateProject{
    @IsOptional()
    date?:Date;
    @IsOptional()
    description?:string[];
    @IsOptional()
    name?:string;
}