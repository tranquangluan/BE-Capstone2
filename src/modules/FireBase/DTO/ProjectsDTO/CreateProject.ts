import { IsOptional } from "class-validator";

export class CreateProject{
    @IsOptional()
    date?:string;
    @IsOptional()
    description?:string[];
    @IsOptional()
    name?:string;
}