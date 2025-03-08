import { Injectable, inject } from '@angular/core';
import {ApiService} from '../api/api.service';

export interface SignInMessage {
  username: string;
  password: string;
}

export interface NetworkUser {
  fname: string;
  lname: string;
  username: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  // Inject apiService
  apiService = inject(ApiService);

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
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
