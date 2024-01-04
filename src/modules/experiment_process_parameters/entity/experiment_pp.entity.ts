import { ExpPpCondition } from 'src/modules/exp_pp_conditions/entity/exp_pp_cond.entity';
import { Experiment } from 'src/modules/experiments/entity/experiment.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity('experiment_Pps')
export class ExperimentProcessParameter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Experiment,
    (experiment) => experiment.experimentProcessParameters,
  )
  @JoinColumn()
  experiment: Experiment;

  @Column('double precision')
  pp: number;

  @Column('double precision')
  value: number;

  @OneToMany(() => ExpPpCondition, (expPpCondition) => expPpCondition.exp_pp, {
    onDelete: 'CASCADE',
  })
  expPpConditions: ExpPpCondition[];

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;
}
