import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject  } from '@angular/fire/database';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor (
    private db: AngularFireDatabase
  ) { }

  save(user: firebase.User) {
    this.db.object('/users/' + user.uid).update({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      emailVerified: user.emailVerified,
    });
  }

  get(uid: string){
    return this.db.object('/users/' + uid).valueChanges();
  }
}
