import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-desktop-login-page',
  imports: [],
  templateUrl: './desktop-login-page.component.html',
  styleUrl: './desktop-login-page.component.scss'
})
export class DesktopLoginPageComponent {
  //make a Router object to do the routing
  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
