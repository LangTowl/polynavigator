import {Component, inject} from '@angular/core';
import {LoginServiceService} from '../../services/login/login-service.service';

@Component({
  selector: 'app-mobile-login-page',
  imports: [],
  templateUrl: './mobile-login-page.component.html',
  styleUrl: './mobile-login-page.component.scss'
})
export class MobileLoginPageComponent {

  private loginService = inject(LoginServiceService)

  login() {
    this.loginService.signInRequest("username", "password");
  }
}
