import { Routes } from '@angular/router';

import { getPlatform } from './services/breakpoint/breakpoint.util';
import {MobileLoginPageComponent} from './views/mobile-login-page/mobile-login-page.component';
import {DesktopLoginPageComponent} from './views/desktop-login-page/desktop-login-page.component';
import {MobileMapPageComponent} from './views/mobile-map-page/mobile-map-page.component';
import {DesktopMapPageComponent} from './views/desktop-map-page/desktop-map-page.component';
import {NavigationGuardGuard} from './guards/navigation-guard.guard';

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
    path: 'map',
    component: getPlatform() === 'mobile' ? MobileMapPageComponent : DesktopMapPageComponent,
    canActivate: [NavigationGuardGuard]
  }
];
