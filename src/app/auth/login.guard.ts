import { CanActivateFn } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {

    if (sessionStorage.getItem('authToken') ) {
      return true;  
    } else {
      return false;
    }

}