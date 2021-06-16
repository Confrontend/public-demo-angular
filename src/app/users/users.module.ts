import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users-overview/users.component';
import { BaseTableComponent } from '../shared/base-table/base-table.component';
import { SharedModule } from '../shared/shared.module';
import { CustomMaterialModule } from '../shared/custom-material.module';
@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, SharedModule, CustomMaterialModule],
  exports: [UsersComponent],
})
export class UsersModule {}
