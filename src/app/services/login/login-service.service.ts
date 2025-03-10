import { Injectable, inject } from '@angular/core';
import {ApiService} from '../api/api.service';
import {TokenHandlerService} from '../token-handler/token-handler.service';

export interface SignInMessage {
  username: string;
  password: string;
}

export interface NetworkUser {
  fname: string;
  lname: string;
  username: string;
}

export interface AuthenticatedUser {
  user: NetworkUser;
  token: string;
}

export interface SignInResponse {
  ok: boolean;
  message: string;
  user?: AuthenticatedUser;
}

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  // Inject services
  apiService = inject(ApiService);
  tokenHandler = inject(TokenHandlerService);

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
        } else {
          console.log("Bad sign in");
        }
      },
      error: (error) => {
        console.log("Error encountered in signInRequest: " + error);
      }
    });
  }
}
