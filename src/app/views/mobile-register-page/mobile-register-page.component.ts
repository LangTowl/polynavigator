import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AccountCreatorService} from '../../services/account-creator/account-creator.service';

@Component({
  selector: 'app-mobile-register-page',
  imports: [
    FormsModule
  ],
  templateUrl: './mobile-register-page.component.html',
  styleUrl: './mobile-register-page.component.scss'
})
export class MobileRegisterPageComponent {
  // Inject services
  private accountCreatorService = inject(AccountCreatorService);

  //make a Router object to do the routing
  constructor(private router: Router) {}

  // Input fields
  username: string = "Bob"
  password: string = "12345678";
  passwordConfirm: string = "12345678";

  goToRegister() {
    this.router.navigate(['/login']);
  }

  /**
   * Attempt to register new user from mobile
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
