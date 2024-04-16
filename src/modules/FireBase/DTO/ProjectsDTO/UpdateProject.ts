import { IsOptional } from "class-validator";

export class UpdateProject{
    @IsOptional()
    date?:Date;
    @IsOptional()
    description?:string[];
    @IsOptional()
    name?:string;
}