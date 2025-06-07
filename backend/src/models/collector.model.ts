import {Entity, model, property} from '@loopback/repository';

@model()
export class Collector extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'boolean',
  })
  isActive?: boolean;

  @property({
    type: 'string',
    required: true,
  })
  license: string;

  @property({
    type: 'string',
    required: true,
  })
  cpf: string;


  constructor(data?: Partial<Collector>) {
    super(data);
  }
}

export interface CollectorRelations {
  // describe navigational properties here
}

export type CollectorWithRelations = Collector & CollectorRelations;
