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

  /**
   * Sends get request to server to get map nodes
   * @param endpoint -> target endpoint on server
   */
  requestMapNodes(endpoint: string = "/map-nodes") {
    // Check to see if nodes are already in storage
    if (localStorage.getItem('map-nodes') === null) {
      console.log("Nodes not found in cash. Requesting them from server...");
    } else {
      console.log("Nodes found in cash. No request sent.");
      return;
    }

    // Collect user token
    let token = this.tokenHandler.fetchToken() ?? "";

    this.apiService.apiGetRequest<MapRequestResponse>(endpoint, [["token", token]]).subscribe({
      next: (response: MapRequestResponse) => {

        // If response exists, store in local storage
        if (response) {
          localStorage.setItem('map-nodes', JSON.stringify(response));
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  /**
   * Returns array of Node objects, empty array if no nodes exists
   */
  fetchMapFromStorage(): MapRequestResponse {
    // Check if nodes are loated in storage
    if (localStorage.getItem('map-nodes') === null) {
      alert("No nodes found in cache...");
      return [];
    } else {
      return JSON.parse(localStorage.getItem('map-nodes') ?? "[]") as MapRequestResponse;
    }
  }
}
