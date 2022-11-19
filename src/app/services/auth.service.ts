import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { switchMap } from 'rxjs/operators';
import { User } from '../shared/user';
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/firestore";
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userObs: Observable<firebase.User>;
  public user$: Observable<User>;  
  private loading: any;

  constructor(
    public afAuth: AngularFireAuth,
    private userService: UserService,
    private afStor: AngularFirestore,
    public router: Router,
    private toastCtr: ToastController,
    private loadCtr: LoadingController,
  ) { 
    this.userObs = this.afAuth.authState;
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if(user){
          return this.afStor.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    )
  }
  
  async userLogin(email: string, password: string): Promise<User>{
    try {
      const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.updateUserData(user);
      return user;
      console.log(user);
    } catch (error) {
      console.log(error)
      let message: string;
      switch(error.code){
        case 'auth/user-not-found': message='Email ou senha inválido!';
        break;
        case 'auth/invalid-email': message='Digite um email válido!';
        break;
        case 'auth/wrong-password': message='Email ou senha inválido!';
        break;
        case 'auth/network-request-failed': message='sem conexão!';
        break;
      }
      this.presentToast(message);
    }
  }

  async loginGoogle(): Promise<User> {
    try {    
    const { user } = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.updateUserData(user);
    if(user){
      const verified = this.verifiedEmail(user);
      this.redirectUser(verified);
    }
    return user;
    } catch (error) {console.log(error)
      let message: string;
      switch(error.code){
        case 'auth/popup-closed-by-user': message='sem conexão!';
        break;
      }
      this.presentToast(message);
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

  async register(email: string, password: string): Promise<User>{
    try {
      const { user } = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.verificationEmail();
      return user;
    } catch (error) {      
      console.log(error)
      let message: string;
      switch(error.code){
        case 'auth/user-not-found': message='Email ou senha inválido!';
        break;
        case 'auth/invalid-email': message='Digite um email válido!';
        break;
        case 'auth/weak-password': message='Digite uma senha com mínimo de 6 digitos!';
        break;
        case 'auth/email-already-in-use': message='Já existe um cadastro com esse email!';
        break;
        case 'auth/network-request-failed': message='sem conexão!';
        break;
      }
      this.presentToast(message);
    }
  }
  
  async verificationEmail(): Promise<void>{
    try {
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
      console.log(error);
    }
  }
  
 verifiedEmail(user: User): boolean{
    return user.emailVerified === true ? true: false;
  }

  async resetPassword(email: string): Promise<void>{
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }

  getAuth() {
    return this.afAuth;
  }

  logout() { 
    this.afAuth.signOut();
  }

  private updateUserData(user: User){
    const userRef: AngularFirestoreDocument<User> = this.afStor.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
    };
    return userRef.set(data, {merge: true});
  }
  
  get appUserObs(): Observable<User>{
    return this.userObs.pipe(switchMap(user =>{return this.userService.get(user.uid) as Observable<User>}))
  }

  async presentToast(message: string) {
    const toast = await this.toastCtr.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadCtr.create({ message: 'Carregando...' });
    return this.loading.present();
  }
}
