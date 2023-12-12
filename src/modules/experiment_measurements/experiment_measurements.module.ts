import { Module, forwardRef } from '@nestjs/common';
import { ExpMeasService } from './service/exp_meas.service';
import { ExperimentsModule } from '../experiments/experiments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentMeasurement } from './entity/experiment_measurement.entity';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExperimentMeasurement]),
    forwardRef(() => ExperimentsModule),
    SharedModule,
  ],
  providers: [ExpMeasService],
  exports: [ExpMeasService, TypeOrmModule],
})
export class ExperimentMeasurementsModule {}
