import {Component, inject} from '@angular/core';
import {GeolocatorService} from '../../services/geolocator/geolocator.service';
// import {LoginServiceService} from '../../services/login/login-service.service';

@Component({
  selector: 'app-mobile-login-page',
  imports: [],
  templateUrl: './mobile-login-page.component.html',
  styleUrl: './mobile-login-page.component.scss'
})
export class MobileLoginPageComponent {

  // private loginService = inject(LoginServiceService)
  private geolocoation = inject(GeolocatorService);

  async fetchGPSLocation() {
    try {
      const position = await this.geolocoation.fetchGPSLocation();
      console.log(position);
    } catch (error) {
      console.log("Error: " + error);
    }
  }
}
