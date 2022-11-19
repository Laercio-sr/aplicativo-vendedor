import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { ImagePicker } from '@ionic-native/image-picker/ngx';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


import { LoginPage } from './pages/login/login.page';
import { ProductsPage } from './pages/products/products.page';
import { OrdersPage } from './pages/orders/orders.page';
import { ProductFormPage } from './pages/product-form/product-form.page';
import { FormsModule } from '@angular/forms';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { EmailVerifiedPage } from './pages/email-verified/email-verified.page';
import { ResetPasswordPage } from './pages/reset-password/reset-password.page';
import { RegisterPage } from './pages/register/register.page';
import { ImagesPage } from './pages/images/images.page';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from "@angular/fire/storage";
import { Clipboard } from '@ionic-native/clipboard/ngx';

@NgModule({
  declarations: [
    AppComponent,
    LoginPage,
    RegisterPage,
    ResetPasswordPage,
    EmailVerifiedPage,
    OrdersPage,
    ProductsPage,    
    ProductFormPage,
    ImagesPage,
    ToolbarComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    AngularFirestoreModule, 
    AngularFireStorageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ImagePicker,
    Clipboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
