import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loadingInterceptor
      ])
    ),
    provideRouter(routes),
    BsDatepickerModule.forRoot().providers!,
    provideAnimations(),
    provideHttpClient(),
    NgxMaskModule.forRoot({
      showMaskTyped: false,
    }).providers!,
    provideToastr(),
  ],

};
