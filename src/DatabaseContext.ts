import { Injectable, Scope } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class DatabaseContext {
  queryRunner: QueryRunner;
}
