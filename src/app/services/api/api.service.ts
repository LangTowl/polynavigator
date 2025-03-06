import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Inject http client
  http = inject(HttpClient);

  // Local vars
  private url = 'https://c13c-146-148-102-151.ngrok-free.app';

  constructor() { }

  apiGetRequest() {
    this.http.get(this.url)
      .subscribe((message) => {
          console.log(message);
      });
  }
}
