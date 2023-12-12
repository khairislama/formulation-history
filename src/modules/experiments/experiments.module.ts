import { Module, forwardRef } from '@nestjs/common';
import { ExperimentsController } from './controller/experiments.controller';
import { ExperimentsService } from './service/experiments.service';
import { ExperimentIngredientsModule } from '../experiment_ingredients/experiment_ingredients.module';
import { ExperimentProcessParametersModule } from '../experiment_process_parameters/experiment_process_parameters.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiment } from './entity/experiment.entity';
import { ExperimentMeasurementsModule } from '../experiment_measurements/experiment_measurements.module';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Experiment]),
    forwardRef(() => ExperimentIngredientsModule),
    forwardRef(() => ExperimentProcessParametersModule),
    forwardRef(() => ExperimentMeasurementsModule),
    SharedModule,
  ],
  controllers: [ExperimentsController],
  providers: [ExperimentsService],
  exports: [TypeOrmModule, ExperimentsService],
})
export class ExperimentsModule {}
