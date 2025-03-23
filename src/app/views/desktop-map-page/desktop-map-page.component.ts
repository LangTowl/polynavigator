import { Component, inject } from '@angular/core';
import {GetMapService} from '../../services/get-map/get-map.service';

@Component({
  selector: 'app-desktop-map-page',
  imports: [],
  templateUrl: './desktop-map-page.component.html',
  styleUrl: './desktop-map-page.component.scss'
})
export class DesktopMapPageComponent {
  // Import service
  getMapService = inject(GetMapService);

  requestMapNodes() {
    console.log("Component debug.");
    this.getMapService.requestMapNodes();
  }
}
