import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentsComponent } from './assignments/assignments.component';
import { GroupsComponent } from './groups/groups-overview/groups.component';
import { UsersComponent } from './users/users-overview/users.component';

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full',
  },
  { path: 'users', component: UsersComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'assignments', component: AssignmentsComponent },
  {
    path: '**',
    redirectTo: '/users',
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
