import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Coletor} from '../models';
import {ColetorRepository} from '../repositories';

export class ColetorController {
  constructor(
    @repository(ColetorRepository)
    public coletorRepository : ColetorRepository,
  ) {}

  @post('/coletors')
  @response(200, {
    description: 'Coletor model instance',
    content: {'application/json': {schema: getModelSchemaRef(Coletor)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Coletor, {
            title: 'NewColetor',
            exclude: ['id'],
          }),
        },
      },
    })
    coletor: Omit<Coletor, 'id'>,
  ): Promise<Coletor> {
    return this.coletorRepository.create(coletor);
  }

  @get('/coletors/count')
  @response(200, {
    description: 'Coletor model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Coletor) where?: Where<Coletor>,
  ): Promise<Count> {
    return this.coletorRepository.count(where);
  }

  @get('/coletors')
  @response(200, {
    description: 'Array of Coletor model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Coletor, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Coletor) filter?: Filter<Coletor>,
  ): Promise<Coletor[]> {
    return this.coletorRepository.find(filter);
  }

  @patch('/coletors')
  @response(200, {
    description: 'Coletor PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Coletor, {partial: true}),
        },
      },
    })
    coletor: Coletor,
    @param.where(Coletor) where?: Where<Coletor>,
  ): Promise<Count> {
    return this.coletorRepository.updateAll(coletor, where);
  }

  @get('/coletors/{id}')
  @response(200, {
    description: 'Coletor model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Coletor, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Coletor, {exclude: 'where'}) filter?: FilterExcludingWhere<Coletor>
  ): Promise<Coletor> {
    return this.coletorRepository.findById(id, filter);
  }

  @patch('/coletors/{id}')
  @response(204, {
    description: 'Coletor PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Coletor, {partial: true}),
        },
      },
    })
    coletor: Coletor,
  ): Promise<void> {
    await this.coletorRepository.updateById(id, coletor);
  }

  @put('/coletors/{id}')
  @response(204, {
    description: 'Coletor PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() coletor: Coletor,
  ): Promise<void> {
    await this.coletorRepository.replaceById(id, coletor);
  }

  @del('/coletors/{id}')
  @response(204, {
    description: 'Coletor DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.coletorRepository.deleteById(id);
  }
}
