import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Inject http client
  http = inject(HttpClient);

  // Local vars
  private url = 'http://127.0.0.1:5000';

  constructor() { }

  apiGetRequest() {
    this.http.get<{ message: string }>(this.url)
      .pipe(
        map(response => response.message),
        catchError((error) => {
          console.log(error)
          throw error;
        })
      )
      .subscribe((message) => {
          console.log(message);
      });
  }

  apiPostRequest() {
    this.http.post<{ message: string }>(this.url, "RAH")
      .pipe(
        map(response => response.message),
        catchError((error) => {
          console.log(error)
          throw error;
        })
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
}
