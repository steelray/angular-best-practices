import {
  Directive,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
  inject,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Observable } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

@Directive({
  selector: '[appExhaustedEvent]',
  standalone: true,
})
export class ExhaustedEventDirective<T> implements AfterViewInit {
  /**
   * Which DOM event to listen for. Works with any native event.
   * Default: 'click'
   */
  @Input('appExhaustedEvent') eventName: keyof HTMLElementEventMap | string = 'click';

  /**
   * The function whose observable will be "exhausted".
   * Required: must return Observable<T>
   */
  @Input({ required: true }) handler!: () => Observable<T>;

  /**
   * Emits the value from the handler's observable on success.
   */
  @Output() exhaustedEventResult = new EventEmitter<T>();

  /**
   * Optional: emit errors if you want to handle them in the template or parent.
   */
  @Output() exhaustedEventError = new EventEmitter<unknown>();

  private readonly destroyRef = inject(DestroyRef);

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    fromEvent(this.el.nativeElement, this.eventName as string)
      .pipe(
        // While handler() is running, ignore new events.
        exhaustMap(() => this.handler()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (value) => this.exhaustedEventResult.emit(value),
        error: (err) => this.exhaustedEventError.emit(err),
      });
  }
}