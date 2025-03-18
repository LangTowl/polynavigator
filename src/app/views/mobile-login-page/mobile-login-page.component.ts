import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-mobile-login-page',
  imports: [],
  templateUrl: './mobile-login-page.component.html',
  styleUrl: './mobile-login-page.component.scss'
})
export class MobileLoginPageComponent {
  //make a Router object to do the routing
  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
