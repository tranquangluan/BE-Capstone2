import { ApiBody, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
export enum CategoryType {
  Experience = 'Experience',
  Project = 'Project',
  
}
export class ReWriteContentDTO {
  @ApiProperty({
    description: 'The category type (Experience or Project)',
    example: CategoryType.Experience,
  })
  @IsString()
  @IsEnum(CategoryType)
  @Transform(({ value }) => CategoryType[value])
  category: CategoryType;

  @IsString()
  @ApiProperty()
  label: string;

  @IsString()
  @ApiProperty()
  content: string;

}
export function ApiRewriteText() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiBody({ type: ReWriteContentDTO })(target, propertyKey, descriptor);
    ApiResponse({ status: 200, description: 'Returns the generated text' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 404, description: 'Not Found' })(
      target,
      propertyKey,
      descriptor,
    );
    ApiResponse({ status: 500, description: 'Internal Server Error' })(
      target,
      propertyKey,
      descriptor,
    );
  };
}