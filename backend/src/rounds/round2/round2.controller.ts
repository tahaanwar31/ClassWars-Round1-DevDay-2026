import { Controller, Post, Body } from '@nestjs/common';
import { Round2Service } from './round2.service';

@Controller('round2')
export class Round2Controller {
  constructor(private round2Service: Round2Service) {}

  @Post('level-complete')
  async completeLevel(@Body() body: { teamName: string; level: number }) {
    const { teamName, level } = body;
    if (!teamName || !level) {
      return { error: 'teamName and level are required' };
    }
    return this.round2Service.completeLevel(teamName, level);
  }
}
