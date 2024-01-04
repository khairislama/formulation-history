import { ExperimentProcessParameter } from 'src/modules/experiment_process_parameters/entity/experiment_pp.entity';
import { Experiment } from 'src/modules/experiments/entity/experiment.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('exp_pp_conditions')
export class ExpPpCondition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ExperimentProcessParameter,
    (experiment_pp) => experiment_pp.expPpConditions,
  )
  @JoinColumn()
  exp_pp: ExperimentProcessParameter;

  @ManyToOne(() => Experiment, (experiment) => experiment.expPpCondition)
  @JoinColumn()
  experiment: Experiment;

  @Column('double precision')
  condition: number;

  @Column('double precision', { nullable: true })
  value: number;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;
}
