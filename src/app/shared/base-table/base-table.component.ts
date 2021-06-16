import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss'],
})
export class BaseTableComponent implements OnInit {
  @Input()
  rows: any = [];

  @Input()
  columns: any = [];

  @Input()
  columnTitles: any = [];

  @Output() selectedRow = new EventEmitter<any>();

  selected = null;

  constructor() {}

  ngOnInit(): void {}

  onRowCLicked(value: any) {
    this.selected = value;
    this.selectedRow.emit(value);
  }

  isRowSelected(value: any) {
    return value === this.selected;
  }
}
