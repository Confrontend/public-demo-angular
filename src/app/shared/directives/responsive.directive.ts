import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { map, startWith, takeUntil } from 'rxjs/operators';

const breakpoints = {
  small: '(max-width: 899px)',
  large: '(min-width: 900px)',
};

@Directive({
  selector: '[appResponsive]',
})
export class ResponsiveDirective implements OnInit, OnDestroy {
  @Input() appResponsive: keyof typeof breakpoints = 'large';
  private _onDestroy$ = new Subject<boolean>();

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {}

  ngOnInit() {
    const breakpoint = breakpoints[this.appResponsive];
    this.fromMediaQuery(breakpoint)
      .pipe(takeUntil(this._onDestroy$))
      .subscribe((matches) => {
        matches ? this.vcr.createEmbeddedView(this.tpl) : this.vcr.clear();
      });
  }

  ngOnDestroy(): void {
    this._onDestroy$.next(true);
    this._onDestroy$.complete();
  }

  fromMediaQuery(breakpoint: string) {
    const media = matchMedia(breakpoint);

    return fromEvent<MediaQueryListEvent>(media, 'change').pipe(
      map((e: MediaQueryListEvent) => e.matches),
      startWith(media.matches)
    );
  }
}
