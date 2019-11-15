import { Component, OnInit } from '@angular/core';
import {AuthService} from './services/auth.service'
import {AngularFireDatabase } from '@angular/fire/database'

import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  constructor(public auth: AuthService) {}
  
  ngOnInit(){
  }

  createPostFlag= false;
  signIn = false;

  //Input: None
  //Output: None
  //Inside of the HTML there is a ngIf div that checks if this is true, if it is true we display the create post
  showPostCreation(){
    this.createPostFlag = !this.createPostFlag;
  }
  
  //Input: Actually doesnt matter
  //Output: None
  //Event Trigger is when a user submits their post
  createPost(eventData: boolean) {
    this.createPostFlag = !this.createPostFlag;
  }

  //Input: A boolean to determine if this is going to be enable or disabling scrolling (AKA Opening or closing the post)
  //Output: None
  //Event Trigger is when a user opens a post
  openPost(eventData: boolean) {
    if(eventData == true){
      //Body Scroll is a livesaver allows us to select an element and disable or enable all scrolling involved with this element
      //(npm install body-scroll-lock) to install
      disableBodyScroll(document.getElementById("siteContainer"));
    }
    else{
      enableBodyScroll(document.getElementById("siteContainer"));
    }
  }


  openRegistration(){
    this.signIn = true;
    disableBodyScroll(document.getElementById("siteContainer"));
  }

  closeRegistration(eventData: boolean){
    this.signIn = eventData;
    enableBodyScroll(document.getElementById("siteContainer"))
  }
 
 
  
 
}
