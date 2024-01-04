import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpPpCondition } from '../entity/exp_pp_cond.entity';
import { Repository } from 'typeorm';
import { DatabaseContext } from 'src/DatabaseContext';

@Injectable({ scope: Scope.REQUEST })
export class ExpPpCondService {
  constructor(
    @InjectRepository(ExpPpCondition)
    private readonly expPpCondRepo: Repository<ExpPpCondition>,
    private readonly db: DatabaseContext,
  ) {}

  async findOneById(id: string) {
    const entity = await this.expPpCondRepo
      .createQueryBuilder('entity')
      .leftJoinAndSelect('entity.exp_pp', 'exp_pp')
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

  async create(expPpCond, expPpId): Promise<ExpPpCondition> {
    const queryRunner = this.db.queryRunner;
    const expPp = queryRunner.manager.create('experiment_Pps', {
      id: expPpId,
    });
    const entity = await this.expPpCondRepo
      .createQueryBuilder('entity')
      .where({
        exp_pp: {
          id: expPpId,
        },
        condition: expPpCond.condition,
      })
      .getOne();

    if (entity) {
      console.log('error');
    }

    try {
      const newExpPpCond = queryRunner.manager.create(
        this.expPpCondRepo.target,
        {
          value: expPpCond.value,
          condition: expPpCond.condition,
          exp_pp: expPp,
        },
      );

      console.log(newExpPpCond);
      return await queryRunner.manager.save(newExpPpCond);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async update(expPpCond, updateDto): Promise<ExpPpCondition> {
    const queryRunner = this.db.queryRunner;
    if (updateDto.value !== undefined) {
      expPpCond.value = updateDto.value;
    }
    try {
      return await queryRunner.manager.save(expPpCond);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async updateDeleteStatus(id: string, isDeleted: boolean) {
    const queryRunner = this.db.queryRunner;
    const entity = await this.expPpCondRepo.findOne({ where: { id } });

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
