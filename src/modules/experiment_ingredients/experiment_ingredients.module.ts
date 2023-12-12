import { Module, forwardRef } from '@nestjs/common';
import { ExpIngService } from './service/exp_ing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExperimentIngredient } from './entity/experiment_ingredient.entity';
import { ExperimentsModule } from '../experiments/experiments.module';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExperimentIngredient]),
    forwardRef(() => ExperimentsModule),
    SharedModule,
  ],
  providers: [ExpIngService],
  exports: [ExpIngService, TypeOrmModule],
})
export class ExperimentIngredientsModule {}
