import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/shared/user';

@Component({
  selector: 'app-email-verified',
  templateUrl: './email-verified.page.html',
  styleUrls: ['./email-verified.page.scss'],
})
export class EmailVerifiedPage {
  user$: Observable<User> = this.authServ.afAuth.user;

  constructor(
    private authServ: AuthService,
    private toastCtr: ToastController
  ) { } 

  async sendEmail(): Promise<void> {
    try {
      await this.authServ.verificationEmail();
    } catch (error) {
      console.log(error)
      let message: string;
      switch(error.code) {
        case 'auth/too-many-requests': message='Email reenviado com sucesso!';
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

}
