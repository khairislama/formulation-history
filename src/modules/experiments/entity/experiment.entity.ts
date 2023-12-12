import { ExperimentIngredient } from 'src/modules/experiment_ingredients/entity/experiment_ingredient.entity';
import { ExperimentMeasurement } from 'src/modules/experiment_measurements/entity/experiment_measurement.entity';
import { ExperimentProcessParameter } from 'src/modules/experiment_process_parameters/entity/experiment_pp.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('experiments')
export class Experiment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'V1' })
  version: string;

  @Column()
  status: string;

  @Column('text', { nullable: true })
  note: string;

  @OneToMany(
    () => ExperimentIngredient,
    (experimentIngredient) => experimentIngredient.experiment,
    {
      onDelete: 'CASCADE',
    },
  )
  experimentIngredients: ExperimentIngredient[];

  @OneToMany(
    () => ExperimentProcessParameter,
    (experimentProcessParameter) => experimentProcessParameter.experiment,
    {
      onDelete: 'CASCADE',
    },
  )
  experimentProcessParameters: ExperimentProcessParameter[];

  @OneToMany(
    () => ExperimentMeasurement,
    (experimentMeasurement) => experimentMeasurement.experiment,
    {
      onDelete: 'CASCADE',
    },
  )
  experimentMeasurements: ExperimentMeasurement[];

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;
}
