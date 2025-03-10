import { Injectable, inject } from '@angular/core';
import {ApiService} from '../api/api.service';
import {catchError, map, Observable, of} from 'rxjs';

export interface ValidateToken {
  token: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenHandlerService {
  // Inject api service
  apiService = inject(ApiService);

  // Key for JWT token
  private readonly JWT: string = "jwt";

  constructor() { }

  /**
   * Fetch token from session storage
   */
  fetchToken(): string | null {
    return sessionStorage.getItem(this.JWT);
  }

  /**
   * Update token stored in local storage
   * @param token
   */
  updateToken(token: string): void {
    sessionStorage.setItem(this.JWT, token);

    console.log("Token stored.");
  }

  /**
   * Delete token from local storage
   */
  deleteToken() {
    sessionStorage.removeItem(this.JWT);
  }

  validateToken(endpoint = "/validate-token"): Observable<boolean> {
    // Fetch token from local storage
    let token: string | null = this.fetchToken();

    // Check if token is valid
    if (!token) {
      console.log("Token not found.");

      return new Observable<boolean>(observer => {
        observer.next(false);
        observer.complete();
      });
    }

    // Generate payload
    const payload = {
      token: token
    }

    // Check for token validity
    return this.apiService.apiPostRequest(endpoint, payload).pipe(
      map((response: TokenValidationResponse) => {
        console.log("Response to JWT verification: " + response.valid);

        return response.valid;
      }),
      catchError((error) => {
        console.error("Error encountered in validateToken: " + error);

        return of(false);
      })
    );
  }
}
