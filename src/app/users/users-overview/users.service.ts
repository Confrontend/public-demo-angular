import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_USERS } from 'src/app/shared/consts';
import { LoggerService } from 'src/app/core/services/logger.service';
import {
  catchError,
  retryWhen,
  delay,
  take,
  takeUntil,
  filter,
} from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { IUser } from 'src/app/shared/shared-interfaces';

@Injectable()
export class UsersService {
  private readonly _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private logger: LoggerService) {}

  fetchUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(URL_USERS).pipe(
      filter((res) => !!res),
      retryWhen((errors) => errors.pipe(delay(1000), take(3))),
      catchError((error) => {
        throw error;
      })
    );
  }

  createUser(user: IUser): Observable<IUser> {
    return this.http
      .post<IUser>(URL_USERS, { id: uuid(), ...user }, this._httpOptions)
      .pipe(
        catchError((error) => {
          this.logger.log('Create user http' + JSON.stringify(user));
          throw error;
        })
      );
  }

  deleteUser(user: IUser): Observable<ArrayBuffer> {
    return this.http.delete<any>(`${URL_USERS}/${user.id}`).pipe(
      catchError((error) => {
        this.logger.log('Delete user http' + JSON.stringify(user));
        throw error;
      })
    );
  }
}
