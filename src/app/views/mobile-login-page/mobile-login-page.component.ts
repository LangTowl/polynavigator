import { Component, inject } from '@angular/core';
import {Router} from '@angular/router';
import {LoginServiceService} from '../../services/login/login-service.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-mobile-login-page',
  imports: [
    FormsModule,
  ],
  templateUrl: './mobile-login-page.component.html',
  styleUrl: './mobile-login-page.component.scss'
})
export class MobileLoginPageComponent {
  // Inject services
  private loginService = inject(LoginServiceService)

  //make a Router object to do the routing
  constructor(private router: Router) {}

  // Form fields
  username: string = "Bob";
  password: string = "123";

  /**
   * Navigate to register from login
   */
  goToRegister() {
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
