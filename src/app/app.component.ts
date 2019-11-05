import { Component } from '@angular/core';
import {AuthService} from './services/auth.service'
import {AngularFireDatabase } from '@angular/fire/database'


import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public auth: AuthService) {}
  


  displayPost= false;
  
  post(){
    this.displayPost = !this.displayPost;
  }
  
  handlePost(eventData: boolean) {
    this.displayPost = !this.displayPost;
  }

 
 
}
