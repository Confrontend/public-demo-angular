import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentsComponent } from './assignments.component';
import { SharedModule } from '../shared/shared.module';
import { CustomMaterialModule } from '../shared/custom-material.module';

@NgModule({
  declarations: [AssignmentsComponent],
  imports: [CommonModule, SharedModule, CustomMaterialModule],
  exports: [AssignmentsComponent],
})
export class AssignmentsModule {}
