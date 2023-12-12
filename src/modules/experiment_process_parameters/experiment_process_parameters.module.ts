import { Module, forwardRef } from '@nestjs/common';
import { ExpPpService } from './service/exp_pp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentProcessParameter } from './entity/experiment_pp.entity';
import { ExperimentsModule } from '../experiments/experiments.module';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExperimentProcessParameter]),
    forwardRef(() => ExperimentsModule),
    SharedModule,
  ],
  providers: [ExpPpService],
  exports: [TypeOrmModule, ExpPpService],
})
export class ExperimentProcessParametersModule {}
