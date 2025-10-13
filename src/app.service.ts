import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Automatic deployment test using github actions and aws ec2!!!';
  }
}
