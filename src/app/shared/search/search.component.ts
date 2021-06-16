import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Output() onSearch = new EventEmitter<any>();

  @Input() searchResult = ''

  constructor() {}

  onChangeEvent(event: any) {
    this.onSearch.emit(event.target.value);
  }
}
