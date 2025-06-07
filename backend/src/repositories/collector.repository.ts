import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {EcoletaDataSource} from '../datasources';
import {Collector, CollectorRelations} from '../models';

export class CollectorRepository extends DefaultCrudRepository<
  Collector,
  typeof Collector.prototype.id,
  CollectorRelations
> {
  constructor(
    @inject('datasources.ecoleta') dataSource: EcoletaDataSource,
  ) {
    super(Collector, dataSource);
  }
}
