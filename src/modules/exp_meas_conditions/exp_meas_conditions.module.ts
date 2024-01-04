import { Module, forwardRef } from '@nestjs/common';
import { ExpMeasCondService } from './service/exp_meas_cond.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpMeasCondition } from './entity/exp_meas_cond.entity';
import { ExperimentsModule } from '../experiments/experiments.module';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpMeasCondition]),
    forwardRef(() => ExperimentsModule),
    SharedModule,
  ],
  providers: [ExpMeasCondService],
  exports: [TypeOrmModule, ExpMeasCondService],
})
export class ExpMeasConditionsModule {}
