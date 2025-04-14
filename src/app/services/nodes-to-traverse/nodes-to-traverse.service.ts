import { Injectable, inject } from '@angular/core';
import {ApiService} from '../api/api.service';
import {TokenHandlerService} from '../token-handler/token-handler.service';
import {NodesToTraverse} from '../interfaces/network-interfaces';

@Injectable({
  providedIn: 'root'
})
export class NodesToTraverseService {
  // Inject services
  apiService = inject(ApiService);
  tokenHandler = inject(TokenHandlerService);

  constructor() { }

  /**
   * Requests route between start and end node, returns NodesToTraverse obj
   * @param start -> number, start location id
   * @param end -> number start location id
   * @param endpoint -> target backend endpoint
   * @param isGroup -> boolean stfu
   */
  requestTraversalGraph(start: number , end: string, isGroup: boolean, endpoint: string = "/traverse") {
    // Collect user token
    let token = this.tokenHandler.fetchToken() ?? "";

    this.apiService.apiGetRequest<NodesToTraverse>(endpoint, [["token", token], ["start", start.toString()], ["end", end], ["is_group", isGroup.toString()]]).subscribe({
      next: (response: NodesToTraverse) => {
        if (response) {
          sessionStorage.setItem('nodes-to-traverse', JSON.stringify(response));
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  fetchNodesToTraverse() {
    // Check if nodes are located in storage
    if (sessionStorage.getItem('nodes-to-traverse') === null) {
      alert("No nodes found in cache...");
      return [];
    } else {
      return JSON.parse(sessionStorage.getItem('nodes-to-traverse') ?? "[]") as NodesToTraverse;
    }
  }
}
