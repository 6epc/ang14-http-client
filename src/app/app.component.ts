import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { Todo, TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  sub!: Subscription;
  loading = false;
  error = '';

  todos: Todo[] = [];
  todoTitle!: string;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.fetchTodo();
  }

  fetchTodo() {
    this.loading = true;
    this.todoService.fetchTodo()
      .subscribe(
        {
          next: response => {
            this.todos = response;
            this.loading = false;
          },
          error: e => this.error = e.message + ' from app.component',
          complete: () => console.log('request completed: app.component')
        }
      );
  }

  addTodo() {
    if (!this.todoTitle.trim()) {
      return
    }
    //adding new block(post... anything)
    this.todoService.addTodo({ title: this.todoTitle, completed: false })
      .subscribe(data => {
        this.todos.push(data);
        this.todoTitle = "";
      });
  }

  removeTodo(id?: number) {
    this.todoService.removeTodo(id)
      .subscribe(() => {
        this.todos = this.todos.filter(todo => todo.id !== id);
      });
  }

  completeTodo(id?: number) {
    this.todoService.completeTodo(id)
      .subscribe(todo => {
        // ! - знак-обещание. Объект перед этим знаком не null и не undefind
        this.todos.find(t => t.id === todo.id)!.completed = true
      });
  }

  unsub() {
    this.sub.unsubscribe();
  }
}
