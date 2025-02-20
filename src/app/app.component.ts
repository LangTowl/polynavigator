import { inject } from '@angular/core';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ApiService } from './services/api/api.service';
import { catchError } from 'rxjs';

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

  ngOnInit() {
    console.log('ngOnInit');
  }

  pingApi() {
    console.log('ping');

    this.apiService.messageApi()
      .pipe(
        catchError((error) => {
          console.log(error)
          throw error;
        })
      )
      .subscribe((response) => {
        console.log(response);
      });
  }
}
