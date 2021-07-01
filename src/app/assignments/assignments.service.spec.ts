import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AssignmentsService } from './assignments.service';
import { URL_ASSIGNMENTS, URL_USERS, URL_GROUPS } from '../shared/consts';
import { LoggerService } from '../core/services/logger.service';
import { first } from 'rxjs/operators';

fdescribe('AssignmentsService', () => {
  let service: AssignmentsService;
  let httpMock: HttpTestingController;
  let loggerServiceSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    loggerServiceSpy = jasmine.createSpyObj('LoggerService', ['log']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AssignmentsService,
        {
          provide: LoggerService,
          useValue: loggerServiceSpy,
        },
      ],
    });

    service = TestBed.inject(AssignmentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  xit('should fetch asignments correctly', (done) => {
    const dummyAssignments = [
      {
        id: '1',
        userId: 'user1',
        groupId: 'group1',
      },
    ];

    const dummyGroups = [
      {
        id: 'group1',
        name: 'Group 1',
        desc: 'leo, in lobortis tellus justo sit amet',
      },
    ];

    const dummyUsers = [
      {
        id: 'user1',
        name: 'Hamed',
        email: 'hamed@ga.com',
      },
    ];

    service
      .fetchAssignments()
      .pipe(first())
      .subscribe((assignments) => {
        expect(assignments.length).toBe(1);
        expect(assignments[0].userNames).toEqual([dummyUsers[0].name]);
        expect(assignments[0].groupName).toEqual(dummyGroups[0].name);
        done();
      });

    const assignment = httpMock.expectOne(URL_ASSIGNMENTS);
    const users = httpMock.expectOne(URL_USERS);
    const groups = httpMock.expectOne(URL_GROUPS);

    assignment.flush(dummyAssignments);
    users.flush(dummyUsers);
    groups.flush(dummyGroups);

    expect(service).toBeTruthy();
  });

  it('should show error on create an asignment failed', (done) => {
    service
      .createAssignment('', '')
      .pipe(first())
      .subscribe(
        (res) => res,
        (err) => {
          expect(loggerServiceSpy.log).toHaveBeenCalledOnceWith(
            'Create user http{"userId":"","groupId":""}'
          );
          done();
        }
      );

    const assignment = httpMock.expectOne({
      method: 'POST',
      url: URL_ASSIGNMENTS,
    });

    assignment.flush([], {
      status: 400,
      statusText: 'failed',
    });
  });
});
