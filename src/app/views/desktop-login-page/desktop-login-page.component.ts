import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {LoginServiceService} from '../../services/login/login-service.service';

@Component({
  selector: 'app-desktop-login-page',
  imports: [
    FormsModule
  ],
  templateUrl: './desktop-login-page.component.html',
  styleUrl: './desktop-login-page.component.scss'
})
export class DesktopLoginPageComponent {
  // Inject services
  private loginService = inject(LoginServiceService)


  constructor(private router: Router) {}

  // Form fields
  username: string = "";
  password: string = "";

  /**
   * Navigate to register from login
   */
  goToRegister() {
    console.log('Navigating to Register page...');

    this.router.navigate(['/register']);
  }

  /**
   * Attempt to log in user based on username and password credentials
   */
  attemptLogin() {
    if (this.username === "" || this.password === "") {
      console.log("Login form Incomplete.");

      alert("Please fill in all fields.");
    } else {
      console.log("Attempting to login -> " + this.username + ".");

      this.loginService.signInRequest(this.username, this.password);
    }
  }
}
