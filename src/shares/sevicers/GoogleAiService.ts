import { Injectable } from '@nestjs/common';
import { TextServiceClient } from '@google-ai/generativelanguage';
import { GoogleAuth } from 'google-auth-library';
import { GoogleGenerativeAI } from '@google/generative-ai';



@Injectable()
export class GoogleAiService {
  private textServiceClient: TextServiceClient;
  private generativeAI: GoogleGenerativeAI;

  constructor() {
    this.textServiceClient = new TextServiceClient({
      authClient: new GoogleAuth().fromAPIKey("AIzaSyA6N9hV4IMKHr7YUGSDjDW2Chw9sK0eDzo"),
    });
    this.generativeAI = new GoogleGenerativeAI("AIzaSyA6N9hV4IMKHr7YUGSDjDW2Chw9sK0eDzo");
  }

  async generateGeminiPro(prompt: string): Promise<string> {
    const geminiProModel = this.generativeAI.getGenerativeModel({
      model: 'gemini-pro',
    });
    const result = await geminiProModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async generateText(prompt: string): Promise<string> {
    const result = await this.textServiceClient.generateText({
      model: process.env.GEMINI_PRO_MODEL_NAME,
      prompt: {
        text: prompt,
      },
    });
    const generatedText = result[0]?.candidates[0]?.output;
    return generatedText;
  }
}
