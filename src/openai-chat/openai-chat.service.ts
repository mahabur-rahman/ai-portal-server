import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

@Injectable()
export class OpenaiChatService {
  private readonly logger = new Logger(OpenaiChatService.name);
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not found in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: apiKey || 'dummy-key', // Fallback for development
    });
  }

  async createChatCompletion(
    messages: ChatCompletionMessageParam[],
    model: string = 'gpt-3.5-turbo',
  ) {
    try {
      this.logger.log(`Creating chat completion with model: ${model}`);

      const completion = await this.openai.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return {
        success: true,
        data: completion.choices[0]?.message,
        usage: completion.usage,
      };
    } catch (error) {
      this.logger.error('Error creating chat completion:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create chat completion';
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async createStreamingChatCompletion(
    messages: ChatCompletionMessageParam[],
    model: string = 'gpt-3.5-turbo',
  ) {
    try {
      this.logger.log(
        `Creating streaming chat completion with model: ${model}`,
      );

      const stream = await this.openai.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      });

      return stream;
    } catch (error) {
      this.logger.error('Error creating streaming chat completion:', error);
      throw error;
    }
  }
}
