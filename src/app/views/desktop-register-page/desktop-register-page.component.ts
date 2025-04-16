import { Component, inject } from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AccountCreatorService} from '../../services/account-creator/account-creator.service';

@Component({
  selector: 'app-desktop-register-page',
  imports: [
    FormsModule
  ],
  templateUrl: './desktop-register-page.component.html',
  styleUrl: './desktop-register-page.component.scss'
})
export class DesktopRegisterPageComponent {
  // Inject services
  private accountCreatorService = inject(AccountCreatorService);

  //make a Router object to do the routing
  constructor(private router: Router) {}

  // Input fields
  username: string = ""
  password: string = "";
  passwordConfirm: string = "";

  /**
   * Navigate to log in from register page
   */
  goToLogin() {
    this.router.navigate(['/login']);
  }

  /**
   * Attempt to register new user
   */
  attemptRegistration() {
    // Fields are incomplete
    if (this.username === "" || this.password === "" || this.passwordConfirm === "") {
      console.log("Login form Incomplete.");

      alert("Please complete all fields.");

      return;
    }

    // Passwords do not match
    if (this.password !== this.passwordConfirm) {
      console.log("Passwords don't match.");

      alert("Passwords don't match.");

      return;
    }

    console.log("Attempting to register -> " + this.username + ".");

    this.accountCreatorService.createAccountRequest(this.username, this.password);
  }
}
