import { ApiBody, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GenerateTextDTO {
  @ApiProperty({ example: 'Your prompt text here' })
  @IsString()
  prompt: string;
}

export function ApiGenerateText() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiBody({ type: GenerateTextDTO })(target, propertyKey, descriptor);
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
