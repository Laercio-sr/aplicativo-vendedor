import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage  {
  private loading: any;
  showPassword = false;
  passwordToggleIcon = 'eye-off';
  
  constructor(
    private Auth:AuthService, 
    public router: Router,
    private loadCtr: LoadingController,
    private toastCtr: ToastController
    
  ) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    if(this.passwordToggleIcon == 'eye') {
      this.passwordToggleIcon = 'eye-off';
    }else {
      this.passwordToggleIcon = 'eye';
    }
  }

  loginGoogle(){
    this.Auth.loginGoogle();
  }

  async login(email, password){
    await this.presentLoading();
    try {
      const user = await this.Auth.userLogin(email.value, password.value);
      if(user){
        const verified = this.Auth.verifiedEmail(user);
        this.redirectUser(verified);
      }
    } catch (error) {
    }finally{
      this.loading.dismiss();
    }
  }  

  private redirectUser(verified: boolean): void{
    if(verified){
      this.router.navigate(['orders']);
    }else{
      this.router.navigate(['email-verified']);
    }
  }

  async presentLoading() {
    this.loading = await this.loadCtr.create({ message: 'Carregando...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtr.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
