// Ficheiro: src/app/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // "Ouve" o estado de login do serviço
  return authService.isLoggedIn$.pipe(
    take(1), // Pega apenas no valor mais recente
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // Se estiver logado, permite o acesso
      }
      // Se não estiver logado, redireciona para a página de login
      router.navigate(['/login']);
      return false;
    })
  );
};