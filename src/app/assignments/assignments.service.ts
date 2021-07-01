import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { LoggerService } from '../core/services/logger.service';
import { URL_ASSIGNMENTS, URL_GROUPS, URL_USERS } from '../shared/consts';
import {
  IAssignment,
  IAssignmentApi,
  IGroup,
  IUser,
} from '../shared/shared-interfaces';
import { v4 as uuid } from 'uuid';
import { groupBy } from '../shared/utils/data-mapper.util';

@Injectable()
export class AssignmentsService {
  private readonly _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  // TODO only used to save time, bad practice !
  public users: IUser[] = [];
  public groups: IGroup[] = [];

  private _usersSubject$ = new BehaviorSubject<IUser[]>([] as IUser[]);
  public users$ = this._usersSubject$.asObservable();

  public assignments: IAssignmentApi[] = [];

  private _groupsSubject$ = new BehaviorSubject<IGroup[]>([] as IGroup[]);
  public groups$ = this._groupsSubject$.asObservable();

  constructor(private http: HttpClient, private logger: LoggerService) {}

  fetchAssignments(): Observable<IAssignment[]> {
    return forkJoin([
      this.http.get<IAssignmentApi[]>(URL_ASSIGNMENTS),
      this.http.get<IUser[]>(URL_USERS),
      this.http.get<IGroup[]>(URL_GROUPS),
    ]).pipe(
      map(([assigns, users, groups]: [IAssignmentApi[], IUser[], IGroup[]]) => {
        // TODO only used to save time, bad practice ! fetchAssignments should have a single responsibility
        this._usersSubject$.next(users);
        this._groupsSubject$.next(groups);
        this.assignments = assigns;
        // ...............................
        const res: any = groupBy<IAssignmentApi>(assigns, 'groupId', 'userId');
        const mappedResult = res?.map((each: any) => ({
          groupName: groups.find((g) => g.id == each['groupId'])?.name,
          userNames: users
            .filter((u: any) => {
              return !!each['userId'].find((u1: any) => u.id == u1.userId);
            })
            ?.map((res) => res.name),
        }));
        return mappedResult
      })
    );
  }

  // TODO check for already existing assignment
  createAssignment(userId: string, groupId: string): Observable<IAssignment> {
    return this.http
      .post<IAssignment>(
        URL_ASSIGNMENTS,
        { id: uuid(), ...{ userId, groupId } },
        this._httpOptions
      )
      .pipe(
        catchError((error) => {
          this.logger.log(
            'Create user http' + JSON.stringify({ userId, groupId })
          );
          throw error;
        })
      );
  }
}
