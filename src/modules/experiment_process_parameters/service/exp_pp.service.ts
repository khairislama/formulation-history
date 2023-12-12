import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExperimentProcessParameter } from '../entity/experiment_pp.entity';
import { Repository } from 'typeorm';
import { DatabaseContext } from 'src/DatabaseContext';

@Injectable({ scope: Scope.REQUEST })
export class ExpPpService {
  constructor(
    @InjectRepository(ExperimentProcessParameter)
    private readonly expPpRepo: Repository<ExperimentProcessParameter>,
    private readonly db: DatabaseContext,
  ) {}

  async findOneById(id: string) {
    const entity = await this.expPpRepo
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

  async create(expPp, experimentId): Promise<ExperimentProcessParameter> {
    const queryRunner = this.db.queryRunner;
    const experiment = queryRunner.manager.create('experiments', {
      id: experimentId,
    });
    const entity = await this.expPpRepo
      .createQueryBuilder('entity')
      .where({
        experiment: {
          id: experimentId,
        },
        pp: expPp.pp,
      })
      .getOne();

    if (entity) {
      console.log('error');
    }
    try {
      const newExpPp = queryRunner.manager.create(this.expPpRepo.target, {
        value: expPp.value,
        pp: expPp.pp,
        experiment: experiment,
      });

      return await queryRunner.manager.save(newExpPp);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async update(expPp, updateDto): Promise<ExperimentProcessParameter> {
    const queryRunner = this.db.queryRunner;
    if (updateDto.value !== undefined) {
      expPp.value = updateDto.value;
    }
    try {
      return await queryRunner.manager.save(expPp);
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async delete(id: string) {
    const queryRunner = this.db.queryRunner;
    const entity = await this.expPpRepo.findOne({ where: { id: id } });

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
