import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { NavigationGuardGuard } from './navigation-guard.guard';

describe('navigationGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => NavigationGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
