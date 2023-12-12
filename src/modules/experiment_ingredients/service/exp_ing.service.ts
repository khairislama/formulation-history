import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExperimentIngredient } from '../entity/experiment_ingredient.entity';
import { Repository } from 'typeorm';
import { DatabaseContext } from 'src/DatabaseContext';

@Injectable({ scope: Scope.REQUEST })
export class ExpIngService {
  constructor(
    @InjectRepository(ExperimentIngredient)
    private readonly expIngRepo: Repository<ExperimentIngredient>,
    private readonly db: DatabaseContext,
  ) {}

  async findOneById(id: string) {
    const entity = await this.expIngRepo
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

  async create(expIng, experimentId): Promise<ExperimentIngredient> {
    const queryRunner = this.db.queryRunner;
    const experiment = queryRunner.manager.create('experiments', {
      id: experimentId,
    });
    const entity = await this.expIngRepo
      .createQueryBuilder('entity')
      .where({
        experiment: {
          id: experimentId,
        },
        ingredient: expIng.ingredient,
      })
      .getOne();

    if (entity) {
      console.log('error');
    }
    try {
      const newExpIng = queryRunner.manager.create(this.expIngRepo.target, {
        value: expIng.value,
        ingredient: expIng.ingredient,
        experiment: experiment,
      });

      const savedExpIng = await queryRunner.manager.save(newExpIng);
      return savedExpIng;
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async update(expIng, updateDto): Promise<ExperimentIngredient> {
    const queryRunner = this.db.queryRunner;
    if (updateDto.value !== undefined) {
      expIng.value = updateDto.value;
    }
    try {
      const savedExpIng = await queryRunner.manager.save(expIng);
      return savedExpIng;
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async delete(id: string) {
    const queryRunner = this.db.queryRunner;
    const entity = await this.expIngRepo.findOne({ where: { id: id } });

    if (!entity) {
      console.log('no entity');
    }

    try {
      entity.is_deleted = true;
      return await queryRunner.manager.save(entity);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }
}
