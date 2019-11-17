import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import {AuthService} from '../services/auth.service'

import * as firebase from 'firebase/app';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(public auth: AuthService) { }

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
  }


  async signInEmailPass(){    
    var email = (<HTMLInputElement>document.getElementById("email")).value;
    var password = (<HTMLInputElement>document.getElementById("password")).value;
  
    var createResult = await this.auth.emailSignIn(email,password);
    this.notify.emit(false);
  }

  closeSignIn(){
    this.notify.emit(false);
  }

  async signInGoogle(){     
    var user = await this.auth.googleSignin();
    this.notify.emit(false);
  }

  async signInFacebook(){
    var user = this.auth.facebookSignin();
    this.notify.emit(false);
  }

  async signInTwitter(){
      var user = this.auth.twitterSignin();
      this.notify.emit(false);
  }

}
