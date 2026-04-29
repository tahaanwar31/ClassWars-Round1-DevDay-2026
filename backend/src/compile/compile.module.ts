import { Module } from '@nestjs/common';
import { CompileController } from './compile.controller';

@Module({
  controllers: [CompileController],
})
export class CompileModule {}
