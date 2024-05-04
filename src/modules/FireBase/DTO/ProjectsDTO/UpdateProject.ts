import { IsOptional } from "class-validator";

export class UpdateProject{
    @IsOptional()
    date?:string;
    @IsOptional()
    description?:string[];
    @IsOptional()
    name?:string;
}