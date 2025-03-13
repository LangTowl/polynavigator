import { Injectable } from '@angular/core';
import {Geolocation} from '../interfaces/network-interfaces';


@Injectable({
  providedIn: 'root'
})
export class GeolocatorService {

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
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
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
}
