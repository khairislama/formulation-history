import { Experiment } from 'src/modules/experiments/entity/experiment.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('experiment_measurements')
export class ExperimentMeasurement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => Experiment,
    (experiment) => experiment.experimentMeasurements,
  )
  @JoinColumn()
  experiment: Experiment;

  @Column('double precision')
  measurement: number;

  @Column('double precision')
  value: number;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  //   @OneToMany(
  //     () => ExpMeasCondition,
  //     (expMeasCondition) => expMeasCondition.exp_meas,
  //     {
  //       cascade: true,
  //       onDelete: 'CASCADE',
  //     },
  //   )
  //   expMeasConditions: ExpMeasCondition[];
}
