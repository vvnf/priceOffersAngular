import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { MyOffersComponent } from './pages/my-offers/my-offers.component';
import { AuthGuardGuard } from './auth/auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: "/home",
    pathMatch: 'full'
  },
  { path: 'home', component: MainComponent},
  { path: 'my-offers', component: MyOffersComponent, canActivate:[AuthGuardGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
