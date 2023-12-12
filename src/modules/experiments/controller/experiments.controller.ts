import { Body, Controller, Post } from '@nestjs/common';
import { ExperimentsService } from '../service/experiments.service';
import { Connection } from 'typeorm';
import { DatabaseContext } from 'src/DatabaseContext';

@Controller('experiments')
export class ExperimentsController {
  constructor(
    private readonly experimentService: ExperimentsService,
    private readonly connection: Connection,
    private readonly db: DatabaseContext,
  ) {}

  @Post()
  async processExperiment(@Body() experiments) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    this.db.queryRunner = queryRunner;

    try {
      const result = await this.experimentService.process(experiments);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
