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
  ) 
  {
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

  async emailCreate(email:string,password:string,username:string){
    
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(email,password).catch(function(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(typeof(error))
      console.error(errorCode)
      console.log(errorMessage)      
      if(errorCode == "auth/invalid-email"){
        return -1;
      }
      else if(errorCode == "auth/email-already-in-use"){
        return -2;
      }
      else if(errorCode == "auth/weak-password"){
        return -3;
      }
    })
    console.log("LOGGING PROMISE");
    console.log(credential)
    
    if(typeof credential != 'number'){
      console.log("GOOD CREDIANTAL")
      return  this.updateUserData(credential.user,username);
    }
    else{
      return credential;
    }
  }

  //For facebook you need to go to 
  //https://developers.facebook.com/
  //And register to get an app ID and secret
  //You also need to take the oauth token firebase gives you and put it in with the facebook dev tools
  //Link for this project: https://developers.facebook.com/apps/2569224083305981/fb-login/settings/
  async facebookSignin(username:string){
    const provider = new auth.FacebookAuthProvider();
    // provider.addScope('user_birthday');
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    if(credential.additionalUserInfo.isNewUser == false){
      return this.getUserData(credential.user);
    }
    else{
      this.afs.collection("usernames").doc(username).set({});
      return this.updateUserData(credential.user,username);
    }
  }

  async googleSignin(username:string) {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    if(credential.additionalUserInfo.isNewUser == false){
      return this.getUserData(credential.user);
    }
    else{
      this.afs.collection("usernames").doc(username).set({});
      return this.updateUserData(credential.user,username);
    }
  }

  //For Twitter you need to make a developer account at 
  //https://developer.twitter.com
  //And register to get an app ID and secret
  //Important: In permissions tab turn off write access, we only need to read the user
  //Link for this project: https://developer.twitter.com/en/apps/16997380
  async twitterSignin(username:string){
    const provider = new auth.TwitterAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    if(credential.additionalUserInfo.isNewUser == false){
      return this.getUserData(credential.user);
    }
    else{
      this.afs.collection("usernames").doc(username).set({});
      return this.updateUserData(credential.user,username);
    }
  }
  
  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }

  updateUserData(user,username) {
    console.log(username);
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    
    const data = {
      uid: user.uid,
      username:username,
      email: user.email
    };
    
    return userRef.set(data, { merge: true });

  }

  getUserData(user){
    const userRef:AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    return userRef.get();
  }

}