import { Module } from '@nestjs/common';
import { GoogleAiService } from 'src/shares/sevicers/GoogleAiService';
import { GoogleAiController } from './GoogleAiController';
import { TextNormalizationService } from 'src/shares/sevicers/TextNormalizationService';
import { MappingService} from 'src/shares/sevicers/MappingService'

@Module({
  imports: [],
  controllers: [GoogleAiController],
  providers: [GoogleAiService, TextNormalizationService, MappingService],
})
export class GoogleAiModule {}
