import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

/**
 * Test interface used in test POST request
 */
export interface Test {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Inject http client
  http = inject(HttpClient);

  // Local vars
  private url = 'http://127.0.0.1:5000';

  constructor() { }

  /**
   * Function tests GET request to /test endpoint
   */
  apiTestGetRequest(): Observable<any> {
    // Establish headers for get request
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });

    console.log("Outgoing test GET request sent...");

    return this.http.get<any>(this.url + "/test", {headers: headers});
  }

  /**
   * Function tests POST request to /test endpoint
   */
  apiTestPostRequest(): Observable<any> {
    // Establish headers for get request
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });

    // Assemble test payload
    const payload: Test = {
      message: 'Hello from client.',
    }

    console.log("Outgoing test POST request sent...");

    return this.http.post<any>(this.url + "/test", payload, {headers: headers});
  }

  /**
   * Generic api GET request
   * @param endpoint -> specified target endpoint
   * @param params -> additional headers to be sent with get request
   */
  apiGetRequest<RESPONSE>(endpoint: string, params: [string, string][] | null): Observable<RESPONSE> {
    console.log("Outgoing GET request to " + endpoint + " sent...");

    // Establish headers for get request
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });

    // Dynamically append params to headers
    if (params !== null) {
      params.forEach(([key, value]) => {
        headers = headers.append(key, value);
      });
    }

    return this.http.get<RESPONSE>(this.url + endpoint, {headers: headers});
  }

  /**
   * Generate api POST request
   * @param endpoint -> specified target endpoint
   * @param payload -> contains payload to be sent to the server
   */
  apiPostRequest<PAYLOAD>(endpoint: string, payload: PAYLOAD): Observable<any> {
    console.log("Outgoing POST request to " + endpoint + " sent...");

    // Establish headers for get request
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.post<any>(this.url + endpoint, payload, {headers: headers});
  }
}
