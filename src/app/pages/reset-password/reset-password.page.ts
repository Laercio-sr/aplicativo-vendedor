import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {

  constructor(
    public alertController: AlertController,
    private authServ: AuthService, 
    private toastCtr: ToastController, 
    private router: Router) {}

  async passwordReset(email) {    
    try {
      if(email)
        await this.authServ.resetPassword(email.value);
        this.router.navigate(['/reset-password']);
        await this.showAlert();
    } catch (error) {
      console.log(error)
      let message: string;
      switch(error.code){
        case 'auth/user-not-found': message='Usuário não cadastrado!';
        break;
        case 'auth/invalid-email': message='Digite um email válido!';
        break;
        case 'auth/network-request-failed': message='Sem conexão!';
        break;
      }
      this.presentToast(message);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtr.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Enviado com sucesso!',
      message: 'Um link de redefinição de senha foi enviado para o email informado.',
      buttons: ['OK']
    });
    await alert.present();  
    const result = await alert.onDidDismiss();  
    console.log(result);
  }

}
