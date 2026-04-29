import { Controller, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Controller('compile')
export class CompileController {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('JDOODLE_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('JDOODLE_CLIENT_SECRET') || '';
  }

  @Post()
  async compile(@Body() body: { script: string }) {
    const { script } = body;

    if (!script) {
      return { error: 'No script provided' };
    }

    try {
      const res = await axios.post('https://api.jdoodle.com/v1/execute', {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        script,
        language: 'cpp17',
        versionIndex: '0',
      }, { timeout: 30000 });

      return res.data;
    } catch (err: any) {
      return {
        output: `error: ${err.response?.data?.error || err.message}`,
        statusCode: err.response?.status || 500,
      };
    }
  }
}
