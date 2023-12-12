import { Experiment } from 'src/modules/experiments/entity/experiment.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('experiment_ingredients')
export class ExperimentIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Experiment, (experiment) => experiment.experimentIngredients)
  @JoinColumn()
  experiment: Experiment;

  @Column('double precision')
  ingredient: number;

  @Column('double precision')
  value: number;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;
}
