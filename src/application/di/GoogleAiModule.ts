import { Module } from '@nestjs/common';
import { GoogleAiService } from 'src/application/services/GoogleAiService';
import { GoogleAiController } from '../api/GoogleAiController';
import { TextNormalizationService } from 'src/application/services/TextNormalizationService';
import { MappingService } from 'src/application/services/MappingService';
import { LanguageService } from 'src/application/services/LanguageService';

@Module({
  imports: [],
  controllers: [GoogleAiController],
  providers: [
    GoogleAiService,
    TextNormalizationService,
    MappingService,
    LanguageService,
  ],
})
export class GoogleAiModule {}
