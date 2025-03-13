import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-desktop-register-page',
  imports: [],
  templateUrl: './desktop-register-page.component.html',
  styleUrl: './desktop-register-page.component.scss'
})
export class DesktopRegisterPageComponent {
  //make a Router object to do the routing
  constructor(private router: Router) {}
  //nav back to login
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
