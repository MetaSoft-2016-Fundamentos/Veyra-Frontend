import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Device } from '../domain/model/device.entity';
import { DevicesApiEndpoint } from './devices-api-endpoint';
import {CreateDeviceRequest} from './device.request';

@Injectable({ providedIn: 'root' })
export class TrackingApi extends BaseApi {
  private readonly _devicesApiEndpoint: DevicesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this._devicesApiEndpoint = new DevicesApiEndpoint(http);
  }

  getDevices(nursingHomeId: number): Observable<Device[]> {
    return this._devicesApiEndpoint.getDevices(nursingHomeId);
  }

  createDevice(nursingHomeId: number, request: CreateDeviceRequest): Observable<Device> {
    return this._devicesApiEndpoint.createDevice(nursingHomeId, request);
  }

  getDeviceById(id: number) {
    return this._devicesApiEndpoint.getById(id);
  }

}
