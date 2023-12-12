import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentsModule } from './modules/experiments/experiments.module';
import { ExperimentIngredientsModule } from './modules/experiment_ingredients/experiment_ingredients.module';
import { ExperimentProcessParametersModule } from './modules/experiment_process_parameters/experiment_process_parameters.module';
import { ExperimentMeasurementsModule } from './modules/experiment_measurements/experiment_measurements.module';
import { ExpMeasConditionsModule } from './modules/exp_meas_conditions/exp_meas_conditions.module';
import { ExpPpConditionsModule } from './modules/exp_pp_conditions/exp_pp_conditions.module';
import { SharedModule } from './shared.module';

const typeOrmConfig = () => ({
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  type: 'postgres' as 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'khairislama',
  database: 'for-dev-test',
  synchronize: true,
  logging: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
});

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig()),
    ExperimentsModule,
    ExperimentIngredientsModule,
    ExperimentProcessParametersModule,
    ExperimentMeasurementsModule,
    ExpMeasConditionsModule,
    ExpPpConditionsModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
