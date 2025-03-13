import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {ApiService} from '../api/api.service';
import {TokenHandlerService} from '../token-handler/token-handler.service';
import {NetworkUser, SignInResponse} from '../interfaces/network-interfaces';


@Injectable({
  providedIn: 'root'
})
export class AccountCreatorService {
  // Inject services
  apiService = inject(ApiService);
  tokenHandler = inject(TokenHandlerService);
  router = inject(Router);

  constructor() { }

  createAccountRequest(username: string, password: string, endpoint = "/create-account") {
   // Construct payload
    const payload: NetworkUser = {
      username: username,
      password: password
    }

    this.apiService.apiPostRequest(endpoint, payload).subscribe({
      next: (response: SignInResponse) => {
        if (response.ok) {
          console.log("Server response to account creation request: good");

          this.tokenHandler.updateToken(response.user!.token);

          this.router.navigate(["/map"]);
        } else {
          console.log("Request to create new user denied: " + response.message)
        }
      },
      error: (error) => {
        console.log("Error encountered in createAccountRequest: " + error);
      }
    })
  }
}
