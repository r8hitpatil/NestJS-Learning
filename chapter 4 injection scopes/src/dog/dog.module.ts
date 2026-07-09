import { DynamicModule, Module, Scope } from '@nestjs/common';
import { DogService } from './dog.service';

@Module({})
export class DogModule {
  static register():DynamicModule {
    return {
      module : DogModule,
      providers : [{
        provide : 'DOGESH',
        useClass : DogService,
        scope : Scope.TRANSIENT
      }],
      exports : ['DOGESH']
    }
  }
}