import { Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app'
import { ActivatedRoute } from "@angular/router";

import { Post } from './new-post.model';



@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {


  username: string;
  constructor(public afs: AngularFirestore,private route: ActivatedRoute) { }

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get("username");
  }

  submitData(){
    console.log("Hello World");
    var Inputs = document.getElementsByTagName("input");
    var postBody : string;
    var postTitle : string;
    var postTopic : string;

    postBody = (<HTMLInputElement>document.getElementById("postBody")).value;
    postTitle = (<HTMLInputElement>document.getElementById("postTitle")).value;
    postTopic = (<HTMLInputElement>document.getElementById("postTopic")).value;
   // var postBody = document.getElementById("postBody").getElementsByTagName("input")[0].value;
    var properFormat = true;
    console.log(postTitle);
    console.log(postBody);

    const data = {
      body: postBody,
      poster: this.username,
      title: postTitle,
      postTopic:postTopic
    };

    if(postTitle == null ||postTitle == undefined){
      alert("Enter a post title");
      properFormat = false;
    }
    if(postTitle == null ||postTitle == undefined){
      alert("Enter a post title");
      properFormat = false;
    }
    if(postTopic == null ||postTopic == undefined){
      alert("Enter a post topic");
      properFormat = false;
    }
    if(properFormat == true){
      this.afs.collection("posts").add(data);
      this.notify.emit(true)
    }
    
  }
  close(){
    history.back();
  }
}
