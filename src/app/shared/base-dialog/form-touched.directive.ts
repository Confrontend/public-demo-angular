import { Directive, Self, HostListener } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Directive({
  selector: 'form[formGroup]',
})
export class FormTouchedDirective {
  @HostListener('submit')
  onSubmit() {
    this.container.control!.markAllAsTouched();
  }

  constructor(private container: ControlContainer) {}
}
