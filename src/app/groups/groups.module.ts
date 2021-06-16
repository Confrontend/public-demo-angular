import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsComponent } from './groups-overview/groups.component';
import { SharedModule } from '../shared/shared.module';
import { CustomMaterialModule } from '../shared/custom-material.module';

@NgModule({
  declarations: [GroupsComponent],
  imports: [CommonModule, SharedModule, CustomMaterialModule],
  exports: [GroupsComponent],
})
export class GroupsModule {}
