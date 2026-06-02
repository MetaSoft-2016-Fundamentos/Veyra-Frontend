import { environment } from '../../../environments/environment';
import { Device } from '../domain/model/device.entity';
import { DeviceAssembler } from './device-assembler';
import {DeviceResource, DevicesResponse} from './devices-response';
import {CreateDeviceRequest} from './device.request';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {catchError, map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

const deviceEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderNursingHomesEndpointPath}`;

export class DevicesApiEndpoint extends BaseApiEndpoint<Device, DeviceResource, DevicesResponse, DeviceAssembler> {

constructor(http:HttpClient) {
  super(http,deviceEndpointUrl, new DeviceAssembler());
}

  getDevices(nursingHomeId:number):Observable<Device[]>{
  return this.http.get<DevicesResponse>(`${this.endpointUrl}/${nursingHomeId}/devices`).pipe
  (map((response)=>this.assembler.toEntitiesFromResponse(response)),catchError(this.handleError(`Failed to fetch devices for nursing home ${nursingHomeId}`)),);
   }
  createDevice(nursingHomeId:number,request:CreateDeviceRequest):Observable<Device>{
    return this.http.post<DeviceResource>(`${this.endpointUrl}/${nursingHomeId}/devices`, request).pipe
    (map((resource)=>this.assembler.toEntityFromResource(resource)),catchError(this.handleError(`Failed to register device for nursing home ${nursingHomeId}`)),);
  }

}
