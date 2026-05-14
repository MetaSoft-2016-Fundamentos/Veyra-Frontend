import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Relative} from '../domain/model/relative.entity';
import {RelativeResource, RelativeResponse} from './relative-response';

export class RelativeAssembler implements BaseAssembler<Relative,RelativeResource,RelativeResponse>{
  toResourceFromEntity(entity: Relative): RelativeResource {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      residentId: entity.residentId
    } as RelativeResource;
  }
  toEntitiesFromResponse(response: RelativeResponse): Relative[] {
    return response.relative.map(relative => this.toEntityFromResource(relative));
  }
  toEntityFromResource(resource: RelativeResource): Relative {
    return new Relative({
      id: resource.id,
      name: resource.name,
      email: resource.email,
      residentId: resource.residentId
    });
  }
}
