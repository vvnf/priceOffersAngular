import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';
import { MyOffersComponent } from './pages/my-offers/my-offers.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuardGuard } from './auth/auth-guard.guard';
import { AuthTokenInterceptors } from './interceptor/auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from './pages/_modal';



@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MyOffersComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TagInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    
  ],
  providers: [{
      provide:HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptors,
      multi: true
    },
  AuthGuardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
