import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginPage } from './pages/login/login.page';
import { ProductsPage } from './pages/products/products.page';
import { OrdersPage } from './pages/orders/orders.page';
import { ProductFormPage } from './pages/product-form/product-form.page';
import { RouteGuard } from './services/route.guard';
import { RegisterPage } from './pages/register/register.page';
import { EmailVerifiedPage } from './pages/email-verified/email-verified.page';
import { ResetPasswordPage } from './pages/reset-password/reset-password.page';
import { ImagesPage } from './pages/images/images.page';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
 
  { path: 'register', component: RegisterPage }, 
  { path: 'email-verified', component: EmailVerifiedPage },
  { path: 'reset-password', component: ResetPasswordPage },

  { 
    path: 'login', 
    component: LoginPage, canActivate:[LoginGuard] 
  }, 
  { 
    path: 'orders', 
    component: OrdersPage, canActivate:[AuthGuard]
  },
  { 
    path: 'products/new', 
    component:ProductFormPage, canActivate:[AuthGuard]
  },
  { 
    path: 'products/:id', 
    component: ProductFormPage, canActivate: [AuthGuard]
  },
  { 
    path: 'products', 
    component: ProductsPage ,canActivate:[AuthGuard]
  },
  {
    path: 'images',
    component: ImagesPage ,canActivate:[AuthGuard]
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
