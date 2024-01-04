import { Module, forwardRef } from '@nestjs/common';
import { ExpPpCondService } from './service/exp_pp_cond.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpPpCondition } from './entity/exp_pp_cond.entity';
import { ExperimentsModule } from '../experiments/experiments.module';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpPpCondition]),
    forwardRef(() => ExperimentsModule),
    SharedModule,
  ],
  providers: [ExpPpCondService],
  exports: [TypeOrmModule, ExpPpCondService],
})
export class ExpPpConditionsModule {}
