import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenaiChatService } from './openai-chat.service';
import { OpenaiChatController } from './openai-chat.controller';

@Module({
  imports: [ConfigModule],
  controllers: [OpenaiChatController],
  providers: [OpenaiChatService],
  exports: [OpenaiChatService],
})
export class OpenaiChatModule {}
