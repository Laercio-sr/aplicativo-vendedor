import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {  
  public profilePage =  {
    url: '',
    icon: 'person'
  }
  public appPages = [
    {
      title: 'Produtos Cadastrados',
      url: '/products',
      icon: 'list'
    },
    {
      title: 'Pedidos de Clientes',
      url: '/orders',
      icon: 'list'
    },
    {
      title: 'Carregar Imagens',
      url: '/images',
      icon: 'image'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public Auth:AuthService
  ) {  
    this.initializeApp();
  }
  
  logout(){
    this.Auth.logout()
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
