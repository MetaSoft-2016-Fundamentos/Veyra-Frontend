import { Injectable, signal } from '@angular/core';
import { ActivitiesApi } from '../infrastructure/activities-api';
import { Activity, ActivityType, ActivityStatus } from '../domain/model/activity.entity';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesStore {
  private readonly _activitiesSignal = signal<Activity[]>([]);
  private readonly _selectedActivitySignal = signal<Activity | null>(null);
  private readonly _loadingSignal = signal<boolean>(false);
  private readonly _errorSignal = signal<string | null>(null);

  readonly activities = this._activitiesSignal.asReadonly();
  readonly selectedActivity = this._selectedActivitySignal.asReadonly();
  readonly loading = this._loadingSignal.asReadonly();
  readonly error = this._errorSignal.asReadonly();

  constructor(private activitiesApi: ActivitiesApi) {}

  getAll() {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.activitiesApi.getAll().pipe(retry(2)).subscribe({
      next: activities => {
        this._activitiesSignal.set(activities);
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, 'Failed to fetch activities'));
        this._loadingSignal.set(false);
      }
    });
  }

  getByResidentId(residentId: number) {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.activitiesApi.getByResidentId(residentId).pipe(retry(2)).subscribe({
      next: activities => {
        this._activitiesSignal.set(activities);
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, 'Failed to fetch activities for resident'));
        this._loadingSignal.set(false);
      }
    });
  }

  logActivity(activity: Activity) {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    const logged = activity.log();
    this.activitiesApi.create(logged).pipe(retry(1)).subscribe({
      next: created => {
        this._activitiesSignal.update(list => [...list, created]);
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, 'Failed to log activity'));
        this._loadingSignal.set(false);
      }
    });
  }

  completeActivity(id: number) {
    this._loadingSignal.set(true);
    this._errorSignal.set(null);

    this.activitiesApi.complete(id).pipe(retry(1)).subscribe({
      next: updated => {
        this._activitiesSignal.update(list =>
          list.map(a => a.id === updated.id ? updated : a)
        );
        this._loadingSignal.set(false);
      },
      error: err => {
        this._errorSignal.set(this.formatError(err, `Failed to complete activity ${id}`));
        this._loadingSignal.set(false);
      }
    });
  }

  resetActivities() {
    this._activitiesSignal.set([]);
    this._selectedActivitySignal.set(null);
    this._errorSignal.set(null);
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
