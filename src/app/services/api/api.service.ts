import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Inject http client
  http = inject(HttpClient);

  // Local vars
  private url = 'https://30d7-34-30-87-253.ngrok-free.app';

  constructor() { }

  apiGetRequest(): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get<any>(this.url, {
      headers: headers
    });
  }
}
