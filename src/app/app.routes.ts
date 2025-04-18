import { Routes } from '@angular/router';

import { getPlatform } from './services/breakpoint/breakpoint.util';
import { DesktopLoginPageComponent} from './views/desktop-login-page/desktop-login-page.component';
import { MobileLoginPageComponent } from './views/mobile-login-page/mobile-login-page.component';
import {DesktopRegisterPageComponent} from './views/desktop-register-page/desktop-register-page.component';
import {MobileRegisterPageComponent} from './views/mobile-register-page/mobile-register-page.component';
import {NavigationGuardGuard} from './guards/navigation-guard.guard';
import {MobileMapPageComponent} from './views/mobile-map-page/mobile-map-page.component';
import {DesktopMapPageComponent} from './views/desktop-map-page/desktop-map-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: getPlatform() === 'mobile' ? MobileLoginPageComponent : DesktopLoginPageComponent,
  },
  {
    path: 'register',
    component: getPlatform() === 'mobile' ? MobileRegisterPageComponent : DesktopRegisterPageComponent,
  },
  {
    path: 'map',
    component: getPlatform() === 'mobile' ? MobileMapPageComponent : DesktopMapPageComponent,
    canActivate: [NavigationGuardGuard]
  }
];
