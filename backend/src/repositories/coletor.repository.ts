import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {EcoletaDataSource} from '../datasources';
import {Coletor, ColetorRelations} from '../models';

export class ColetorRepository extends DefaultCrudRepository<
  Coletor,
  typeof Coletor.prototype.id,
  ColetorRelations
> {
  constructor(
    @inject('datasources.ecoleta') dataSource: EcoletaDataSource,
  ) {
    super(Coletor, dataSource);
  }
}
