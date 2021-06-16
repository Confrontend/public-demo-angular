import { Component } from '@angular/core';
import { IMenuItem } from './shared/shared-interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public menuItems: IMenuItem[] = [
    {
      title: 'Users',
      path: '/users',
    },
    {
      title: 'Groups',
      path: '/groups',
    },
    {
      title: 'Assignments',
      path: '/assignments',
    },
  ];
}
