import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseTableComponent } from './base-table/base-table.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomMaterialModule } from './custom-material.module';
import { BaseDialogComponent } from './base-dialog/base-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormTouchedDirective } from './base-dialog/form-touched.directive';
import { ResponsiveDirective } from './directives/responsive.directive';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    BaseTableComponent,
    BaseDialogComponent,
    FormTouchedDirective,
    ResponsiveDirective,
    SearchComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    BaseTableComponent,
    BaseDialogComponent,
    FormTouchedDirective,
    ResponsiveDirective,
    SearchComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
