import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  //So For all of these make sure that in authentication in firebase the sign in method is turned on 

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }


  //For facebook you need to go to 
  //https://developers.facebook.com/
  //And register to get an app ID and secret
  //You also need to take the oauth token firebase gives you and put it in with the facebook dev tools
  //Link for this project: https://developers.facebook.com/apps/2569224083305981/fb-login/settings/
  async facebookSignin(){
    const provider = new auth.FacebookAuthProvider();
    // provider.addScope('user_birthday');
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    console.log(credential);
  }

  //For Twitter you need to make a developer account at 
  //https://developer.twitter.com
  //And register to get an app ID and secret
  //Important: In permissions tab turn off write access, we only need to read the user
  //Link for this project: https://developer.twitter.com/en/apps/16997380
  async twitterSignin(){
    const provider = new auth.TwitterAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    console.log(credential);
  }
  
  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(data, { merge: true });

  }

}