import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_GROUPS } from 'src/app/shared/consts';
import { LoggerService } from 'src/app/core/services/logger.service';
import { catchError, retryWhen, delay, take, filter } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { IGroup } from 'src/app/shared/shared-interfaces';

@Injectable()
export class GroupsService {
  private readonly _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private logger: LoggerService) {}

  fetchGroups(): Observable<IGroup[]> {
    return this.http.get<IGroup[]>(URL_GROUPS).pipe(
      filter((res) => !!res),
      retryWhen((errors) => errors.pipe(delay(1000), take(3))),
      catchError((error) => {
        throw error;
      })
    );
  }

  createGroup(user: IGroup): Observable<IGroup> {
    return this.http
      .post<IGroup>(URL_GROUPS, { id: uuid(), ...user }, this._httpOptions)
      .pipe(
        catchError((error) => {
          this.logger.log('Create user http' + JSON.stringify(user));
          throw error;
        })
      );
  }
}
