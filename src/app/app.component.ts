import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginServiceService} from './services/login/login-service.service';

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

  loginService = inject(LoginServiceService);

  post() {
    console.log("POSTING...");

    this.loginService.signInRequest("username", "password");
  }

}
