import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackingStore } from '../../../application/tracking.store';
import { DeviceType } from '../../../domain/model/device-type.enum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import {CreateDeviceCommand} from '../../../domain/model/create-device.command';
import {trackingNav} from '../../tracking-routes';

@Component({
  selector: 'app-device-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './device-form.html',
  styleUrl: './device-form.css'
})
export class DeviceForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(TrackingStore);

  deviceTypes = Object.values(DeviceType);

  form = this.fb.group({
    deviceType: new FormControl<DeviceType | null>(null, { validators: [Validators.required] })
  });

  isEdit = false;
  deviceId: number | null = null;
  nursingHomeId: number = 0;

  constructor() {
    this.nursingHomeId = Number(localStorage.getItem('nursingHomeId'));

    this.route.params.subscribe(params => {
      this.deviceId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.deviceId;

      if (this.isEdit && this.deviceId) {
        const device = this.store.getDeviceById(this.deviceId)();
        if (device) {
          this.form.patchValue({
            deviceType: device.deviceType as DeviceType
          });
        }
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const command = new CreateDeviceCommand({
      nursingHomeId: this.nursingHomeId,
      deviceType: this.form.value.deviceType!
    });

    if (!this.isEdit) {
      this.store.addDevice(this.nursingHomeId, command);
    }

    this.router.navigate(trackingNav.devices()).then();
  }
}
