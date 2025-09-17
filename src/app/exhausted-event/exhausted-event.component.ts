import { Component, inject, signal } from '@angular/core';
import { ExhaustedEventDirective } from './exhausted-event.directive';
import { HttpClient } from '@angular/common/http';
import { JsonPipe } from '@angular/common';

export interface ITodo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-exhausted-event',
  imports: [
    ExhaustedEventDirective,
    JsonPipe
  ],
  templateUrl: './exhausted-event.component.html',
  styleUrl: './exhausted-event.component.scss'
})
export class ExhaustedEventComponent {
  private readonly infoApi = 'https://jsonplaceholder.typicode.com/todos/1';
  private readonly httpClient = inject(HttpClient);

  todoInfo = signal<ITodo | null>(null);

  getInfo = () => this.httpClient.get<ITodo>(this.infoApi);

  onExhaustedEventResult(event: ITodo): void {
    this.todoInfo.set(event);
  }

}
