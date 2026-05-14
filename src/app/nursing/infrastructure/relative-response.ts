import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface RelativeResource extends BaseResource{
  id: number;
  name: string;
  email: string;
  residentId: number;


}

export interface RelativeResponse extends BaseResponse {
  relative: RelativeResource[];
}
