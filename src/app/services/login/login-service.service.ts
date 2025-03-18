import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {ApiService} from '../api/api.service';
import {TokenHandlerService} from '../token-handler/token-handler.service';
import {SignInMessage, SignInResponse} from '../interfaces/network-interfaces';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  // Inject services
  apiService = inject(ApiService);
  tokenHandler = inject(TokenHandlerService);
  router = inject(Router);

  constructor() { }

  /**
   * Sign user into server
   * @param username -> string
   * @param password -> string
   * @param endpoint -> string
   */
  signInRequest(username: string, password: string, endpoint = "/login") {
    // Construct payload
    const payload: SignInMessage = {
      username: username,
      password: password
    }

    this.apiService.apiPostRequest(endpoint, payload).subscribe({
      next: (response: SignInResponse) => {
        if (response.ok) {
          console.log("Server response to sign in request: good");

          this.tokenHandler.updateToken(response.user!.token);

          this.router.navigate(["/map"]);
        } else {
          console.log("Request to login denied: " + response.message);
        }
      },
      error: (error) => {
        console.log("Error encountered in signInRequest: " + error);
      }
    });
  }
}
