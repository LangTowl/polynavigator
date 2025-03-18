import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import {TokenHandlerService} from '../services/token-handler/token-handler.service';
import {map} from 'rxjs';

export const NavigationGuardGuard: CanActivateFn = () => {
  const tokenHandler = inject(TokenHandlerService);
  const router: Router = inject(Router);

  return tokenHandler.validateToken().pipe(
    map((response: boolean) => {
      if (response) {
        console.log("Navigation request approved.");
        return true;
      } else {
        console.log("Navigation request denied.");
        router.navigate(["/"]);
        return false;
      }
    })
  );
};
