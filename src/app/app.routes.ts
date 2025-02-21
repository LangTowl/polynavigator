import { Routes } from '@angular/router';

import { getPlatform } from '../app/services/breakpoint/breakpoint.util';
import { DesktopManagerComponent} from './views/desktop-manager/desktop-manager.component';
import { MobileManagerComponent } from './views/mobile-manager/mobile-manager.component';

export const routes: Routes = [
  {
    path: '',
    component: getPlatform() === 'mobile' ? MobileManagerComponent : DesktopManagerComponent,
  }
];
