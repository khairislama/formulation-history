import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExperimentMeasurement } from '../entity/experiment_measurement.entity';
import { DatabaseContext } from 'src/DatabaseContext';

@Injectable({ scope: Scope.REQUEST })
export class ExpMeasService {
  constructor(
    @InjectRepository(ExperimentMeasurement)
    private readonly expMeasRepo: Repository<ExperimentMeasurement>,
    private readonly db: DatabaseContext,
  ) {}

  async findOneById(id: string) {
    const entity = await this.expMeasRepo
      .createQueryBuilder('entity')
      .leftJoinAndSelect('entity.experiment', 'experiment')
      .where('entity.id = :id', { id })
      .getOne();

    if (!entity) {
      throw new NotFoundException({
        message: `Not found. Entity with id: ${id} not found.`,
        error: 'ID_NOT_FOUND',
      });
    }

    return entity;
  }

  async create(expMeas, experimentId): Promise<ExperimentMeasurement> {
    const queryRunner = this.db.queryRunner;
    const experiment = queryRunner.manager.create('experiments', {
      id: experimentId,
    });
    const entity = await this.expMeasRepo
      .createQueryBuilder('entity')
      .where({
        experiment: {
          id: experimentId,
        },
        measurement: expMeas.measurement,
      })
      .getOne();

    if (entity) {
      console.log('error');
    }
    try {
      const newExpMeas = queryRunner.manager.create(this.expMeasRepo.target, {
        value: expMeas.value,
        measurement: expMeas.measurement,
        experiment: experiment,
      });

      return await queryRunner.manager.save(newExpMeas);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async update(expMeas, updateDto): Promise<ExperimentMeasurement> {
    const queryRunner = this.db.queryRunner;
    if (updateDto.value !== undefined) {
      expMeas.value = updateDto.value;
    }
    try {
      return await queryRunner.manager.save(expMeas);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async updateDeleteStatus(id: string, isDeleted: boolean) {
    const queryRunner = this.db.queryRunner;
    const entity = await this.expMeasRepo.findOne({ where: { id } });

    if (!entity) {
      console.log('No entity found');
      return null; // or throw an error if needed
    }

    try {
      entity.is_deleted = isDeleted;
      return await queryRunner.manager.save(entity);
    } catch (error) {
      console.error('Error occurred:', error);
      throw error; // Rethrow the error if needed
    }
  }
}
