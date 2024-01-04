import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpMeasCondition } from '../entity/exp_meas_cond.entity';
import { Repository } from 'typeorm';
import { DatabaseContext } from 'src/DatabaseContext';

@Injectable({ scope: Scope.REQUEST })
export class ExpMeasCondService {
  constructor(
    @InjectRepository(ExpMeasCondition)
    private readonly expMeasCondRepo: Repository<ExpMeasCondition>,
    private readonly db: DatabaseContext,
  ) {}

  async findOneById(id: string) {
    const entity = await this.expMeasCondRepo
      .createQueryBuilder('entity')
      .leftJoinAndSelect('entity.exp_meas', 'exp_meas')
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

  async create(expMeasCond, expMeasId): Promise<ExpMeasCondition> {
    const queryRunner = this.db.queryRunner;
    const expMeas = queryRunner.manager.create('experiment_measurements', {
      id: expMeasId,
    });
    const entity = await this.expMeasCondRepo
      .createQueryBuilder('entity')
      .where({
        exp_meas: {
          id: expMeasId,
        },
        condition: expMeasCond.condition,
      })
      .getOne();

    if (entity) {
      console.log('error');
    }

    try {
      const newExpMeasCond = queryRunner.manager.create(
        this.expMeasCondRepo.target,
        {
          value: expMeasCond.value,
          condition: expMeasCond.condition,
          exp_meas: expMeas,
        },
      );

      return await queryRunner.manager.save(newExpMeasCond);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async update(expMeasCond, updateDto): Promise<ExpMeasCondition> {
    const queryRunner = this.db.queryRunner;
    if (updateDto.value !== undefined) {
      expMeasCond.value = updateDto.value;
    }
    try {
      return await queryRunner.manager.save(expMeasCond);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async updateDeleteStatus(id: string, isDeleted: boolean) {
    const queryRunner = this.db.queryRunner;
    const entity = await this.expMeasCondRepo.findOne({ where: { id } });

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
