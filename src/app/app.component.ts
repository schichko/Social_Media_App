import { Component, OnInit } from '@angular/core';
import {AuthService} from './services/auth.service'
import {AngularFireDatabase } from '@angular/fire/database'
import { HostListener } from '@angular/core';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  
  constructor(public auth: AuthService) {  }
  
  ngOnInit(){}


  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    window.onpopstate = function() {
     console.log("GEE")
    }
  }

  registration = false;
  signIn = false;
  searchTopic;

  //Both of these functions may be able to be replaced with routing but since they are in the header it might not be worth it
  openRegistration(){
    this.registration = true;
    disableBodyScroll(document.getElementById("siteContainer"));
  }

  closeRegistration(eventData: boolean){
    console.log("HERE")
    this.registration = eventData;
    enableBodyScroll(document.getElementById("siteContainer"))
  }

  openSignIn(){
    this.signIn = true;
    disableBodyScroll(document.getElementById("siteContainer"));
  }

  closeSignIn(eventData: boolean){
    this.signIn = eventData;
    enableBodyScroll(document.getElementById("siteContainer"))
  }
 
 
  search(event){
    if(event.key === 'Enter'){
      console.log("ERE");
      console.log(this.searchTopic);
      this.searchTopic = (<HTMLInputElement>document.getElementById("searchBar")).value.toLowerCase();
      console.log("BEFORE"+ this.searchTopic)
      if(this.searchTopic == null ||this.searchTopic =="" ||this.searchTopic==undefined){
        this.searchTopic = undefined;
      }
      console.log("AFTER"+ this.searchTopic)
    }
    
  }  

  //Input: None
  //Output: None
  //Each time we tell the angular router we want to display something else, we disable body scroll
  componentAdded($event){
    console.log($event);
    disableBodyScroll(document.getElementById("siteContainer"))
  }

  //Input: None
  //Output: None
  //Each time we go back in the history, either via a button or the actually html back button we want to enable body scroll again
  componentRemoved($event){
    console.log("Removing");
    enableBodyScroll(document.getElementById("siteContainer"))
  }

}
