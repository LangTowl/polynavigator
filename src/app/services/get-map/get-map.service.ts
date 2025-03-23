import { Injectable, inject } from '@angular/core';
import {ApiService} from '../api/api.service';
import {TokenHandlerService} from '../token-handler/token-handler.service';
import {MapRequestResponse} from '../interfaces/network-interfaces';

@Injectable({
  providedIn: 'root'
})
export class GetMapService {
  // Inject services
  apiService = inject(ApiService);
  tokenHandler = inject(TokenHandlerService);

  constructor() { }

  requestMapNodes(endpoint: string = "/map-nodes") {
    console.log("Service debug.");

    // Collect user token
    let token = this.tokenHandler.fetchToken() ?? "";

    this.apiService.apiGetRequest<MapRequestResponse>(endpoint, [["token", token]]).subscribe({
      next: (response: MapRequestResponse) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
