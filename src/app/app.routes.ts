import { Routes } from '@angular/router';

import { getPlatform } from './services/breakpoint/breakpoint.util';
import {MobileLoginPageComponent} from './views/mobile-login-page/mobile-login-page.component';
import {DesktopLoginPageComponent} from './views/desktop-login-page/desktop-login-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: getPlatform() === 'mobile' ? MobileLoginPageComponent : DesktopLoginPageComponent,
  }
];
