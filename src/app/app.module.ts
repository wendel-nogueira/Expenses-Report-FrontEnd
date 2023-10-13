import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";
import { environment } from '../environments/environment';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TokenModule } from './../../libs/interceptor/token/token.module';

export function tokenGetter() {
  return environment.jwtToken;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
    TokenModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return environment.jwtToken;
    },
    whitelistedDomains: [environment.jwtDomain],
  }
}