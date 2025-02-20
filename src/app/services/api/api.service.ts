import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Inject http client
  http = inject(HttpClient);

  constructor() { }

  messageApi() {
    const url = 'https://jsonplaceholder.typicode.com/todos';

    return this.http.get(url);
  }
}
