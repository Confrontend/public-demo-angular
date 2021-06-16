import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CustomMaterialModule } from '../shared/custom-material.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [HeaderComponent],
  imports: [SharedModule, RouterModule, CustomMaterialModule, BrowserModule],
  exports: [HeaderComponent],
})
export class CoreModule {}
