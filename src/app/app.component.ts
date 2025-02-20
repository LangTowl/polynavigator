import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ApiService } from './services/api/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // API injection
  apiService = inject(ApiService);

  // Local stuff
  title = 'campus-nav-front';

  ngOnInit() { }

  getFromApi() {
    this.apiService.apiGetRequest();
  }

  postToApi() {
    this.apiService.apiPostRequest();
  }
}
