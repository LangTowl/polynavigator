import { Injectable } from '@angular/core';

import { Breakpoints, BreakpointObserver} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  isMobile: boolean = false;

  constructor() {
   let breakpointObserver = new BreakpointObserver();

    breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  getPlatform(): 'mobile' | 'desktop' {
    return this.isMobile ? 'mobile' : 'desktop';
  }
}
