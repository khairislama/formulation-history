import { Module } from '@nestjs/common';
import { DatabaseContext } from './DatabaseContext';

@Module({
  providers: [DatabaseContext],
  exports: [DatabaseContext],
})
export class SharedModule {}
