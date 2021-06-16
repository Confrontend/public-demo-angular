import { Component, Input, OnInit } from '@angular/core';
import { IMenuItem } from 'src/app/shared/shared-interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
@Input()
public menuItems : IMenuItem[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
