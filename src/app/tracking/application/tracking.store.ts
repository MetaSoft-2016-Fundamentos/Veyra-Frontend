import {computed, Injectable, Signal, signal} from '@angular/core';
import { retry } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TrackingApi } from '../infrastructure/tracking-api';
import { Device } from '../domain/model/device.entity';
import { CreateDeviceCommand } from '../domain/model/create-device.command';


@Injectable({ providedIn: 'root' })
export class TrackingStore {

  private  readonly  deviceSignal=signal<Device[]>([]);
   readonly  devices=this.deviceSignal.asReadonly();
   readonly  devicesCount = computed(()=>this.devices().length);
   private readonly loadingSignal=signal<boolean>(false);
  private readonly _successMsg = signal<string | null>(null);
  readonly  loading= this.loadingSignal.asReadonly();
  private readonly errorSignal = signal<string | null>(null);
  readonly  error= this.errorSignal.asReadonly();
   constructor(private trackingApi:TrackingApi) {
   }

 loadDevices(nursingHomeId:number):void{
     this.loadingSignal.set(true);
     this.errorSignal.set(null);
     this.trackingApi.getDevices(nursingHomeId).
     pipe(takeUntilDestroyed()).subscribe({
       next : devices =>{
         this.deviceSignal.set(devices);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
       },
       error: err =>{
         this.loadingSignal.set(false);
          this.errorSignal.set(this.formatError(err,'Failed to load devices'));
       }
     });

 }
 addDevice(nursingHomeId:number,command:CreateDeviceCommand):void{
     this.loadingSignal.set(true);
     this.errorSignal.set(null);
     this.trackingApi.createDevice(nursingHomeId,command as any).pipe(retry(2)).subscribe({
       next:(device:Device)=>{
         this.deviceSignal.update((list)=>[...list,device]);
        this._successMsg.set('Device added successfully');
         this.loadingSignal.set(false);
       },
       error:(err:any)=>{
         this.errorSignal.set(this.formatError(err,' Failed to add device'));
         this.loadingSignal.set(false);
       },

     });
 }

getDeviceById(id:number):Signal<Device|undefined>{
     return computed(()=>id?this.devices().find(device=>device.id===id):undefined);
}
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not Found`
        : error.message;
    }
    return fallback;
  }
}
