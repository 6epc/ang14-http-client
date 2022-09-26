import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, delay, map, Observable, tap, throwError } from 'rxjs';

export interface Todo {
  id?: number;
  completed: boolean;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private http: HttpClient,
  ) { }

  fetchTodo(): Observable<any> {

    //multiple params to pass start
    let params = new HttpParams();
    params = params.append('_limit', '3');
    params = params.append('custom', 'anything');
    //multiple params to pass end

    return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos/', {
      // single param to set
      // params: new HttpParams().set('_limit', '3')
      params,
      // observe: 'body' //default
      observe: 'response'
    })
      // emulating delay getting data
      .pipe(
        //no we have to use map() to get response.body which is the same as observe: 'body'
        map(response => {
          return response.body
        }),
        delay(500),
        catchError(error => {
          console.log(`Error: ${error.message} from todo.service`);
          return throwError(error);
        })
      );
  }

  addTodo(todo: Todo): Observable<Todo> {
    const headers = new HttpHeaders({
      'MyCustomHeader': Math.random().toString()
    });

    return this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo, {
      headers
      // second way to use headers - without new HttpHeaders()
      // headers: {
      //   'MyCustomHeader': Math.random().toString()
      // }
    });
  }

  removeTodo(id?: number): Observable<any> {
    return this.http.delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      observe: 'events'
    }).pipe(
      tap(event => {
        if (event.type === HttpEventType.Sent) {
          console.log('Sent', event);
        }

        if (event.type === HttpEventType.Response) {
          console.log('Response', event);
        }
      })
    );
  }

  completeTodo(id?: number): Observable<Todo> {
    return this.http.put<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`,
    { complete: true },
    // default is json
    {responseType: 'json'}
    );
  }

}
