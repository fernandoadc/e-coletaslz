import {Entity, model, property} from '@loopback/repository';

@model()
export class Coletor extends Entity {
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
  nome: string;

  @property({
    type: 'string',
    required: true,
  })
  cpf: string;

  @property({
    type: 'string',
    required: true,
  })
  telefone: string;

  @property({
    type: 'boolean',
  })
  active?: boolean;


  constructor(data?: Partial<Coletor>) {
    super(data);
  }
}

export interface ColetorRelations {
  // describe navigational properties here
}

export type ColetorWithRelations = Coletor & ColetorRelations;
