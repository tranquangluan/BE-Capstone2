import { Injectable } from '@nestjs/common';

@Injectable()
export class TextNormalizationService {
  normalizeText(inputText: string): string {
    // Loại bỏ xuống dòng
    let normalizedText = inputText.replace(/\n/g, ' ');

    // Loại bỏ dấu gạch đầu dòng
    normalizedText = normalizedText.replace(/^- /gm, '');

    // Loại bỏ ký tự đặc biệt trong các dòng bắt đầu bằng gạch đầu dòng
    normalizedText = normalizedText.replace(/^[-•]+/gm, (match) => {
      return match.replace(/[^\w\s:,.-]/g, '');
    });

    // Nối các câu vào nhau
    normalizedText = normalizedText.replace(/(\.\s*)/g, '.');

    return normalizedText.trim();
  }
  
}