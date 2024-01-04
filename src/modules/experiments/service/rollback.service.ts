import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Experiment } from '../entity/experiment.entity';
import { Repository } from 'typeorm';
import { DatabaseContext } from 'src/DatabaseContext';
import { ExpIngService } from 'src/modules/experiment_ingredients/service/exp_ing.service';
import { ExpPpService } from 'src/modules/experiment_process_parameters/service/exp_pp.service';
import { ExpMeasService } from 'src/modules/experiment_measurements/service/exp_meas.service';
import { ExpPpCondService } from 'src/modules/exp_pp_conditions/service/exp_pp_cond.service';
import { ExpMeasCondService } from 'src/modules/exp_meas_conditions/service/exp_meas_cond.service';

@Injectable()
export class RollbackService {
  constructor(
    @InjectRepository(Experiment)
    private experimentRepository: Repository<Experiment>,
    private readonly db: DatabaseContext,
    private readonly expIngService: ExpIngService,
    private readonly expPpService: ExpPpService,
    private readonly expMeasService: ExpMeasService,
    private readonly expPpCondService: ExpPpCondService,
    private readonly expMeasCondService: ExpMeasCondService,
  ) {}

  serviceAssociation = {
    experiment_ingredients: this.expIngService,
    experiment_Pps: this.expPpService,
    experiment_measurements: this.expMeasService,
    exp_pp_conditions: this.expPpCondService,
    exp_meas_conditions: this.expMeasCondService,
  };

  async retrieveHistory(experimentId: string, historyVersion: number) {
    const experiment = await this.experimentRepository.findOne({
      where: { id: experimentId },
    });

    if (!experiment) {
      throw new NotFoundException(
        `Experiment with id ${experimentId} not found`,
      );
    }

    const historyRecords = await this.experimentRepository.query(
      `
          SELECT *
          FROM t_history
          WHERE "experimentId" = $1 AND version >= $2
          ORDER BY version DESC;
        `,
      [experimentId, Number(historyVersion) + 1],
    );

    if (historyRecords.length === 0)
      throw new NotFoundException(
        `No history record for Experiment id ${experimentId} and history version greater than ${historyVersion}`,
      );

    // historyRecords.map((record) => this.retrieveEntity(record));

    return historyRecords;
  }

  retrieveEntity(historyRecord: IHistoryRecord) {
    switch (historyRecord.operation) {
      case operationEnum.INSERT:
        // SOFT DELETE THE ENTITY
        this.serviceAssociation[historyRecord.tabname].updateDeleteStatus(
          historyRecord.new_val.id,
          true,
        );

      case operationEnum.DELETE:
        // Restore the deleted entity
        this.serviceAssociation[historyRecord.tabname].updateDeleteStatus(
          historyRecord.new_val.id,
          false,
        );

      case operationEnum.UPDATE:
        // put old val in entity
        const currentEntity = this.serviceAssociation[
          historyRecord.tabname
        ].findOneById(historyRecord.new_val.id);
        this.serviceAssociation[historyRecord.tabname].update(currentEntity, {
          value: historyRecord.old_val.value,
        });

      default:
        console.log('default');
    }
  }
}

export interface IHistoryRecord {
  id: number;
  tstamp: Date;
  tabname: tabNameEnum;
  operation: operationEnum;
  who: string;
  new_val: Val;
  old_val: Val | null;
  version: number;
  experimentId: string;
}

export interface Val {
  id: string;
  value?: number;
  is_deleted: boolean;
  measurement?: number;
  experimentId?: null | string;
  condition?: number;
  expMeasId?: string;
  name?: string;
  note?: string;
  status?: string;
  version?: string;
  pp?: number;
  ingredient?: number;
}

enum tabNameEnum {
  EXPERIMENTS = 'experiments',
  EXP_ING = 'experiment_ingredients',
  EXP_PP = 'experiment_Pps',
  EXP_MEAS = 'experiment_measurements',
  EXP_PP_COND = 'exp_pp_conditions',
  EXP_MEAS_COND = 'exp_meas_conditions',
}

enum operationEnum {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}
