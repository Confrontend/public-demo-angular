import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil, map, filter, mergeMap } from 'rxjs/operators';
import { LoggerService } from 'src/app/core/services/logger.service';
import { usersToTable } from 'src/app/shared/utils/table-data-adater.util';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseDialogComponent } from 'src/app/shared/base-dialog/base-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IAssignment, IGroup, IUser } from 'src/app/shared/shared-interfaces';
import { AssignmentsService } from './assignments.service';

enum Field {
  GROUP = 'groupName',
  USERS = 'userNames',
}

enum DisplayName {
  GROUP = 'Group',
  USERS = 'Users',
}

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
  providers: [AssignmentsService],
})
export class AssignmentsComponent implements OnInit, OnDestroy {
  public groups$: Observable<IGroup[]> = of([]);
  public users$: Observable<IUser[]> = of([]);
  private _userId: any;
  private _groupId: any;

  @ViewChild('content') assignmentDialogContect!: TemplateRef<any>;

  formGroupAssignments = new FormGroup({
    groups: new FormControl('', null),
    users: new FormControl('', null),
  });

  readonly columns = [Field.GROUP, Field.USERS];

  readonly columnTitles = [DisplayName.GROUP, DisplayName.USERS];

  rows$: Observable<IAssignment[]> = of([]);

  private _onDestroy$ = new Subject<boolean>();

  dialogRef: MatDialogRef<any> = null as any;

  constructor(
    private assignmentsService: AssignmentsService,
    private logger: LoggerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.users$ = this.assignmentsService.users$;
    this.groups$ = this.assignmentsService.groups$;
    this.updateTable();
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
  }

  openAssignUserToGroupDialog(): void {
    this.dialogRef = this.dialog.open(BaseDialogComponent, {
      width: '250px',
      data: {
        form: this.formGroupAssignments,
        fields: [],
        template: this.assignmentDialogContect,
        customValidation: false,
      },
    });

    this.registerDialogForData();
  }

  onSelectionChange(selector: string, event: any) {
    // TODO Find a better way
    if (selector === 'user') {
      this._userId = event?.value?.id;
    } else if (selector === 'group') {
      this._groupId = event?.value?.id;
    }
  }

  registerDialogForData() {
    this.dialogRef
      ?.afterClosed()
      .pipe(
        takeUntil(this._onDestroy$),
        filter((users) => !!users),
        mergeMap((newUser: IUser) =>
          this.assignmentsService.createAssignment(this._userId, this._groupId)
        )
      )
      .subscribe(() => this.updateTable());
  }

  private updateTable() {
    this.rows$ = this.assignmentsService.fetchAssignments();
  }
}
