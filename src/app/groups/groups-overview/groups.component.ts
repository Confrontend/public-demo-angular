import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { takeUntil, map, filter, mergeMap } from 'rxjs/operators';
import { LoggerService } from 'src/app/core/services/logger.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseDialogComponent } from 'src/app/shared/base-dialog/base-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GroupsService } from './groups.service';
import { IGroup } from 'src/app/shared/shared-interfaces';

enum Field {
  NAME = 'name',
}

enum DisplayName {
  NAME = 'Group Name',
}

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  providers: [GroupsService],
})
export class GroupsComponent implements OnInit, OnDestroy {
  private _selectedGroup: IGroup = {} as IGroup;

  formGroup = new FormGroup({
    name: new FormControl(this._selectedGroup?.name, Validators.required),
  });

  readonly columns = [Field.NAME];

  readonly columnTitles = [DisplayName.NAME];
  readonly formFields = [
    {
      name: Field.NAME,
      validators: [Validators.required],
      label: DisplayName.NAME,
      type: 'text',
    },
  ];
  rows$: Observable<IGroup[]> = of([]);

  private _onDestroy$ = new Subject<boolean>();

  dialogRef: MatDialogRef<any> = null as any;

  constructor(
    private groupService: GroupsService,
    private logger: LoggerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.formFields.forEach((field) => {
      this.formGroup.addControl(
        field.name,
        new FormControl('Sushi', field.validators)
      );
    });

    this.updateTable();
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(BaseDialogComponent, {
      width: '250px',
      data: {
        form: this.formGroup,
        fields: this.formFields,
      },
    });

    this.registerDialogForData();
  }
  registerDialogForData() {
    this.dialogRef
      ?.afterClosed()
      .pipe(
        takeUntil(this._onDestroy$),
        filter((users) => !!users),
        mergeMap((newUser: IGroup) => this.groupService.createGroup(newUser))
      )
      .subscribe(() => this.updateTable());
  }
  onRowCLicked(row: IGroup) {
    this._selectedGroup = row;
  }

  private updateTable() {
    this.rows$ = this.groupService.fetchGroups().pipe(
      takeUntil(this._onDestroy$),
      filter((gruops) => !!gruops)
    );
  }
}
