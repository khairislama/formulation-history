import { ExperimentMeasurement } from 'src/modules/experiment_measurements/entity/experiment_measurement.entity';
import { Experiment } from 'src/modules/experiments/entity/experiment.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('exp_meas_conditions')
export class ExpMeasCondition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ExperimentMeasurement,
    (exp_meas) => exp_meas.expMeasConditions,
  )
  @JoinColumn()
  exp_meas: ExperimentMeasurement;

  @ManyToOne(() => Experiment, (experiment) => experiment.expMeasCondition)
  @JoinColumn()
  experiment: Experiment;

  @Column('double precision')
  condition: number;

  @Column('double precision', { nullable: true })
  value: number;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;
}
