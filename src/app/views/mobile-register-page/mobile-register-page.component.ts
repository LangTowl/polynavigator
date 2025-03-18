import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-mobile-register-page',
  imports: [],
  templateUrl: './mobile-register-page.component.html',
  styleUrl: './mobile-register-page.component.scss'
})
export class MobileRegisterPageComponent {
  //make a Router object to do the routing
  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['/login']);
  }
}
