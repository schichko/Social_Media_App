import { Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app'

import { Post } from './new-post.model';



@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  @Input()
  username: string;
  constructor(public afs: AngularFirestore) { }

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
  }
postTitle
  submitData(){postTitle
    console.log("Hello World");postTitle
    var Inputs = document.getElementsByTagName("input");postTitle
    var postBody : string;postTitle
    var postTitle : string;postTitle
    for(var i =0; i<Inputs.length;i++){
      switch(Inputs[i].id){
        case "postBody":
          postBody = Inputs[i].value;
          break;
        
        case "postTitle":
          postTitle = Inputs[i].value;
          break;
          
      }
    }

   // var postBody = document.getElementById("postBody").getElementsByTagName("input")[0].value;
    var properFormat = true;
    console.log(postTitle);
    console.log(postBody);

    const data = {
      poster: this.username,
      title: postTitle,
      body: postBody
    };

    if(postTitle == null ||postTitle == undefined){
      alert("Enter a post title");
      properFormat = false;
    }
    if(postTitle == null ||postTitle == undefined){
      alert("Enter a post title");
      properFormat = false;
    }
    if(properFormat == true){
      this.afs.collection("posts").add(data);
      this.notify.emit(true)
    }
    
  }

}
