import { Directive, Input, Output, EventEmitter, ElementRef, AfterViewInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Observable, of } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

@Directive({
  selector: '[appExhaustedEvent]',
  standalone: true,
})
export class ExhaustedEventDirective<T> implements AfterViewInit {
  @Input('appExhaustedEvent') eventName = 'click';

  // The directive will execute this method's observable stream.
  @Input() handler: () => Observable<T> = () => of(null as unknown as T);

  // The output event emitter to send the result back to the component.
  // It emits the value from the handler's observable.
  @Output() exhaustedEventResult = new EventEmitter<T>();

  private readonly destroyRef$ = inject(DestroyRef);

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    fromEvent(this.el.nativeElement, this.eventName).pipe(
      // Use exhaustMap to handle the inner observable from the handler.
      exhaustMap(() => this.handler()),
      takeUntilDestroyed(this.destroyRef$)
    ).subscribe({
      next: (response) => this.exhaustedEventResult.emit(response),
    });
  }
}