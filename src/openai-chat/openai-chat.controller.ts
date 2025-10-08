import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { OpenaiChatService } from './openai-chat.service';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionDto {
  messages: ChatMessage[];
  model?: string;
  stream?: boolean;
}

@Controller('openai-chat')
export class OpenaiChatController {
  constructor(private readonly openaiChatService: OpenaiChatService) {}

  @Post('chat')
  async createChatCompletion(@Body() chatCompletionDto: ChatCompletionDto) {
    const { messages, model = 'gpt-3.5-turbo' } = chatCompletionDto;
    
    return await this.openaiChatService.createChatCompletion(messages, model);
  }

  @Post('chat/stream')
  async createStreamingChatCompletion(  
    @Body() chatCompletionDto: ChatCompletionDto,
    @Res() res: Response,
  ) {
    const { messages, model = 'gpt-3.5-turbo' } = chatCompletionDto;
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const stream = await this.openaiChatService.createStreamingChatCompletion(messages, model);
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          res.write(content);
        }
      }
      
      res.end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Get('models')
  async getAvailableModels() {
    return {
      models: [
        'gpt-3.5-turbo',
        'gpt-3.5-turbo-16k',
        'gpt-4',
        'gpt-4-turbo',
        'gpt-4o',
      ],
    };
  }
}
