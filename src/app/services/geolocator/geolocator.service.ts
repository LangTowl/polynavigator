import { Injectable } from '@angular/core';
import {Geolocation} from '../interfaces/network-interfaces';


@Injectable({
  providedIn: 'root'
})
export class GeolocatorService {

  // Bounds of map
  topBorder: number = 28.15308;
  bottomBorder: number = 28.14307;
  leftBorder: number = -81.85621;
  rightBorder: number = -81.84151;

  // Image dimensions
  width: number = 1570;
  height: number = 1147;

  constructor() { }

  /**
   * Returns Geolocator interface
   */
  fetchGPSLocation(): Promise<Geolocation> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        console.log("Locating...");

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: this.computeRelativeLat(position.coords.latitude),
              longitude: this.computeRelativeLong(position.coords.longitude),
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        return reject(new Error("Geolocation is not supported by your browser"));
      }
    });
  }

  /**
   * Takes in latitude and returns pixel equivalent
   * @param latitude -> number
   */
  computeRelativeLat(latitude: number): number {
    // Check if lat is in bounds
    if (Math.abs(this.topBorder) >= Math.abs(latitude) && Math.abs(latitude) >= Math.abs(this.bottomBorder)) {
      // Normalize
      let normalize = (Math.abs(latitude) - Math.abs(this.bottomBorder)) / (Math.abs(this.topBorder) - Math.abs(this.bottomBorder))

      // Return conversion
      return this.height - (normalize * this.height);
    }

    return 0;
  }

  /**
   * Takes in longitude and returns pixel equivalent
   * @param longitude -> number
   */
  computeRelativeLong(longitude: number): number {
    // Check if long is in bounds
    if (Math.abs(this.leftBorder) >= Math.abs(longitude) && Math.abs(longitude) >= Math.abs(this.rightBorder)) {
      // Normalize
      let normalize = (Math.abs(longitude) - Math.abs(this.rightBorder)) / (Math.abs(this.leftBorder) - Math.abs(this.rightBorder))

      // Return conversion
      return this.width - (normalize * this.width);
    }

    return 0;
  }
}
