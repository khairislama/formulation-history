import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ExperimentsService } from '../service/experiments.service';
import { Connection } from 'typeorm';
import { DatabaseContext } from 'src/DatabaseContext';
import { RollbackService } from '../service/rollback.service';

@Controller('experiments')
export class ExperimentsController {
  constructor(
    private readonly experimentService: ExperimentsService,
    private readonly rollbackService: RollbackService,
    private readonly connection: Connection,
    private readonly db: DatabaseContext,
  ) {}

  @Get()
  async retrieveHistory(
    @Query('experimentId') experimentId: string,
    @Query('historyVersion') historyVersion: number,
  ) {
    return await this.rollbackService.retrieveHistory(
      experimentId,
      historyVersion,
    );
  }

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
