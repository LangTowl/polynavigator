import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ApiService} from './services/api/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // To silence errors in test script
  title: string = 'campus-nav-front';

  ngOnInit() { }

  apiService = inject(ApiService);

  onTestPress() {
    this.apiService.apiGetRequest();
  }
}
