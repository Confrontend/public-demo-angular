import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { takeUntil, map, filter, mergeMap, tap } from 'rxjs/operators';
import { LoggerService } from 'src/app/core/services/logger.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BaseDialogComponent } from 'src/app/shared/base-dialog/base-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/shared/shared-interfaces';
import { UsersService } from './users.service';

enum Field {
  NAME = 'name',
  CITY = 'city',
  EMAIL = 'email',
}

enum DisplayName {
  NAME = 'User Name',
  CITY = 'City',
  EMAIL = 'Email',
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [UsersService],
})
export class UsersComponent implements OnInit {
  private _selectedUser: IUser = {} as IUser;
  private _dataClientSideSearch: IUser[] = {} as IUser[];
  foundUser = 'Search is case sensetive and results appear here...';

  formGroup = new FormGroup({
    name: new FormControl(this._selectedUser?.name, Validators.required),
    city: new FormControl(this._selectedUser?.name, []),
    email: new FormControl(this._selectedUser?.name, [
      Validators.email,
      Validators.required,
    ]),
  });

  readonly columns = [Field.NAME, Field.CITY, Field.EMAIL];

  readonly columnTitles = [
    DisplayName.NAME,
    DisplayName.CITY,
    DisplayName.EMAIL,
  ];
  readonly formFields = [
    {
      name: Field.NAME,
      validators: [Validators.required],
      label: DisplayName.NAME,
      type: 'text',
    },
    {
      name: Field.CITY,
      validators: [Validators.required],
      label: DisplayName.CITY,
      type: 'text',
    },
    {
      name: Field.EMAIL,
      validators: [Validators.required],
      label: DisplayName.EMAIL,
      type: 'text',
    },
  ];
  rows$: Observable<IUser[]> = of([]);

  private _onDestroy$ = new Subject<boolean>();

  dialogRef: MatDialogRef<any> = null as any;

  constructor(
    private usersService: UsersService,
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
        mergeMap((newUser: IUser) => this.usersService.createUser(newUser))
      )
      .subscribe(() => this.updateTable());
  }
  onRowCLicked(row: IUser) {
    this._selectedUser = row;
  }

  onDeleteUser() {
    this.usersService
      .deleteUser(this._selectedUser)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe(() => this.updateTable());
  }

  search(event: any) {
    console.log(event);

    const searched = this._dataClientSideSearch?.find(
      (u) => u.name === event || u.city === event || u.email === event
    );

    this.foundUser = searched ? JSON.stringify(searched) : '';
  }

  private updateTable() {
    this.rows$ = this.usersService.fetchUsers().pipe(
      tap((users) => (this._dataClientSideSearch = users)),
      takeUntil(this._onDestroy$),
      filter((users) => !!users)
    );
  }
}
