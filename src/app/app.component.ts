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

  displayPost= false;
  
  post(){
    this.displayPost = !this.displayPost;
  }
  
  handlePost(eventData: boolean) {
    this.displayPost = !this.displayPost;
  }

  openPost(eventData: boolean) {
    if(eventData == true){
      disableBodyScroll(document.getElementById("HeyThere"));
    }
    else{
      enableBodyScroll(document.getElementById("HeyThere"));
    }
  }
 
 
 
}
