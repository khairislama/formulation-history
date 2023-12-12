import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experiment } from '../entity/experiment.entity';
import { DatabaseContext } from 'src/DatabaseContext';
import { ExpIngService } from 'src/modules/experiment_ingredients/service/exp_ing.service';
import { ExpPpService } from 'src/modules/experiment_process_parameters/service/exp_pp.service';

@Injectable()
export class ExperimentsService {
  constructor(
    @InjectRepository(Experiment)
    private experimentRepository: Repository<Experiment>,
    private readonly db: DatabaseContext,
    private readonly expIngService: ExpIngService,
    private readonly expPpService: ExpPpService,
  ) {}

  async process(experiments) {
    for (const experiment of experiments) {
      switch (experiment.label) {
        case 'create':
          await this.createExperiment(experiment);
          break;

        case 'update':
          await this.updateExperiment(experiment);
          break;

        default:
          console.log('default');
      }
    }
  }

  private async createExperiment(experiment) {
    const queryRunner = this.db.queryRunner;
    const newExperiment = queryRunner.manager.create(
      Experiment,
      experiment.metadata,
    );
    const savedExperiment = await queryRunner.manager.save(newExperiment);

    await this.handleAssociations(experiment, savedExperiment.id);

    return savedExperiment;
  }

  private async updateExperiment(experiment) {
    const queryRunner = this.db.queryRunner;
    const experimentToUpdate = await this.experimentRepository.findOne({
      where: { id: experiment.id },
    });
    if (experiment.metadata) {
      experimentToUpdate.name = experiment.name ?? experimentToUpdate.name;
      experimentToUpdate.note = experiment.note ?? experimentToUpdate.note;
      experimentToUpdate.status =
        experiment.status ?? experimentToUpdate.status;
    }
    const savedExperiment = await queryRunner.manager.save(experimentToUpdate);

    await this.handleAssociations(experiment, savedExperiment.id);

    return savedExperiment;
  }

  private async handleAssociations(experiment, experimentId: string) {
    if (experiment.ingredients) {
      for (const ingredient of experiment.ingredients) {
        await this.processEntityAssociation(
          ingredient,
          experimentId,
          this.expIngService,
        );
      }
    }
    if (experiment.process_parameters) {
      for (const processParameter of experiment.process_parameters) {
        await this.processEntityAssociation(
          processParameter,
          experimentId,
          this.expPpService,
        );
      }
    }
  }

  private async processEntityAssociation(
    entity,
    experimentId: string,
    service: any,
  ) {
    switch (entity.label) {
      case 'create':
      case 'update':
        return await this.createOrUpdateEntity(
          entity.label,
          entity,
          experimentId,
          service,
        );

      case 'delete':
        return await this.deleteEntity(entity, service);

      default:
        console.log('default');
    }
  }

  private async createOrUpdateEntity(
    operation: 'create' | 'update',
    entity,
    experimentId: string,
    service: any,
  ) {
    if (operation === 'create') {
      return await service.create(entity, experimentId);
    }
    if (operation === 'update') {
      const relationToUpdate = await service.findOneById(entity.id);

      return await service.update(relationToUpdate, entity);
    }
  }

  private async deleteEntity(entity, service: any) {
    return await service.delete(entity.idRelation);
  }
}
