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
import {Collector} from '../models';
import {CollectorRepository} from '../repositories';

export class CollectorController {
  constructor(
    @repository(CollectorRepository)
    public collectorRepository : CollectorRepository,
  ) {}

  @post('/collectors')
  @response(200, {
    description: 'Collector model instance',
    content: {'application/json': {schema: getModelSchemaRef(Collector)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Collector, {
            title: 'NewCollector',
            exclude: ['id'],
          }),
        },
      },
    })
    collector: Omit<Collector, 'id'>,
  ): Promise<Collector> {
    return this.collectorRepository.create(collector);
  }

  @get('/collectors/count')
  @response(200, {
    description: 'Collector model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Collector) where?: Where<Collector>,
  ): Promise<Count> {
    return this.collectorRepository.count(where);
  }

  @get('/collectors')
  @response(200, {
    description: 'Array of Collector model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Collector, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Collector) filter?: Filter<Collector>,
  ): Promise<Collector[]> {
    return this.collectorRepository.find(filter);
  }

  @patch('/collectors')
  @response(200, {
    description: 'Collector PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Collector, {partial: true}),
        },
      },
    })
    collector: Collector,
    @param.where(Collector) where?: Where<Collector>,
  ): Promise<Count> {
    return this.collectorRepository.updateAll(collector, where);
  }

  @get('/collectors/{id}')
  @response(200, {
    description: 'Collector model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Collector, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Collector, {exclude: 'where'}) filter?: FilterExcludingWhere<Collector>
  ): Promise<Collector> {
    return this.collectorRepository.findById(id, filter);
  }

  @patch('/collectors/{id}')
  @response(204, {
    description: 'Collector PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Collector, {partial: true}),
        },
      },
    })
    collector: Collector,
  ): Promise<void> {
    await this.collectorRepository.updateById(id, collector);
  }

  @put('/collectors/{id}')
  @response(204, {
    description: 'Collector PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() collector: Collector,
  ): Promise<void> {
    await this.collectorRepository.replaceById(id, collector);
  }

  @del('/collectors/{id}')
  @response(204, {
    description: 'Collector DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.collectorRepository.deleteById(id);
  }
}
