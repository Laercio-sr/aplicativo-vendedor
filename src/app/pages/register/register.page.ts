import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  newUser: any = {};
  public user: any = {};
  form: FormGroup;
  showPassword = false;
  passwordToggleIcon = 'eye-off';

  constructor (
    private Auth: AuthService,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private router: Router 
  ) { }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
    if(this.passwordToggleIcon == 'eye') {
      this.passwordToggleIcon = 'eye-off';
    }else {
      this.passwordToggleIcon = 'eye';
    }
  }

  async registers(email, password){
    try {
      const user = await this.Auth.register(email.value, password.value);      
      if(user){
        const verified = this.Auth.verifiedEmail(user);
        this.redirectUser(verified);
      }
    } catch (error) {
      console.log(error);
    }
  }

  private redirectUser(verified: boolean): void{
    if(verified){
      this.router.navigate(['/home']);
    }else{
      this.router.navigate(['/email-verified']);
    }    
  }
}