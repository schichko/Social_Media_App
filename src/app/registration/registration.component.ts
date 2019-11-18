import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import {AuthService} from '../services/auth.service'
import * as firebase from 'firebase/app';

import {
  AngularFirestore,
  AngularFirestoreModule,
  AngularFirestoreDocument,
  fromDocRef
} from '@angular/fire/firestore';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  
  constructor(public auth: AuthService,public afs: AngularFirestore) { }

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {

  }
  
  userNameFlag = false;
  userNameInfo = "";
  emailInUseFlag = false;

  async submitEmailPass(){    
    var email = (<HTMLInputElement>document.getElementById("email")).value;
    var password = (<HTMLInputElement>document.getElementById("password")).value;
    var passwordConfirm = (<HTMLInputElement>document.getElementById("passwordConfirm")).value;
    var Username = (<HTMLInputElement>document.getElementById("Username")).value;

    if(Username.length > 1){
      let result = await this.checkUsername(Username); 
      if(result == 1){
        if(password == passwordConfirm){
          let createResult = await this.auth.emailCreate(email,passwordConfirm,Username);
          if(createResult == -1){
            console.log("Incorrect Email Format Please Try Again")
          }
          else if(createResult ==-2){
            console.log("Email Already In Use Please Sign In")
          }
          else if(createResult ==-3){
            console.log("Weak Password")
          }
          else if(createResult ==1){
            console.log("Account created");
            this.notify.emit(false);
          }
        }
      } 
      else{
        console.log("USERNAME ALREADY EXISTS")
      }
    }
   else{
     console.log("BAD");
   }
  }

  closeRegistration(){
    this.notify.emit(false);
  }


  async registerGoogle(){
    var Username = (<HTMLInputElement>document.getElementById("Username")).value;

    if(Username.length >= 1){
      let result = await this.checkUsername(Username); 
      if(result == 1){
        var user = await this.auth.googleRegister(Username);
        if(user == -1){
          console.log("TRY again");
          this.emailInUseFlag = true;
        }
        else{
          this.emailInUseFlag = false;
          this.notify.emit(false);
        }
      }
    }
  }

  async registerFacebook(){
    var Username = (<HTMLInputElement>document.getElementById("Username")).value;

    if(Username.length >= 1){
      let result = await this.checkUsername(Username); 
      if(result == 1){
        var user = await this.auth.facebookRegister(Username);
        if(user == -1){
          console.log("TRY again");
          this.emailInUseFlag = true;
        }
        else{
          this.emailInUseFlag = false;
          this.notify.emit(false);
        }
      }
    }
    
  }

  async registerTwitter(){
    var Username = (<HTMLInputElement>document.getElementById("Username")).value;

    if(Username.length >= 1){
      let result = await this.checkUsername(Username); 
      if(result == 1){  
        var user = await this.auth.twitterRegister(Username);
        if(user == -1){
          console.log("TRY again");
          this.emailInUseFlag = true;
        }
        else{
          this.emailInUseFlag = false;
          this.notify.emit(false);
        }
      }
      
    }
    
  }

  async checkUsernameButton(){
    console.log("CEGE")
    var Username = (<HTMLInputElement>document.getElementById("Username")).value;
    if(Username.length >= 1){
      let result = await this.checkUsername(Username); 
    }
    else{
      this.userNameFlag = true;
      this.userNameInfo= "Username must be at least 1 character";
      document.getElementById("Username").classList.remove("okUserName");
      document.getElementById("Username").classList.add("takenUserName");
    }
  }

  async checkUsername(desiredName:string){
    var count = 0; 
    const firestore = firebase.firestore();
    const snapshot = await firestore

    .collection("usernames")
    .where(firebase.firestore.FieldPath.documentId(), "==", desiredName)
    .get()
      snapshot.forEach(function(doc) {
        count++;
      });
      

    if(count ==0){
      document.getElementById("Username").classList.remove("takenUserName");
      document.getElementById("Username").classList.add("okUserName");
      this.userNameFlag = false;
      // this.userNameInfo = true;
      // console.log("NO MTACHES")
      return 1;
    }
    else{
      this.userNameFlag = true;
      this.userNameInfo = "Username is already taken";
      document.getElementById("Username").classList.remove("okUserName");
      document.getElementById("Username").classList.add("takenUserName");
      
      // console.log("already taken")
      // this.userNameInfo = false;
      return 0;
    }

  }

}
