import { Component, OnInit} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app'
import { ActivatedRoute } from "@angular/router";



@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})

export class NewPostComponent implements OnInit {

  username: string;

  constructor(public afs: AngularFirestore,private route: ActivatedRoute) { }

  ngOnInit() {
    //Gets the username from the query parameter
    this.username = this.route.snapshot.paramMap.get("username");
  }

  //Inputs: None
  //Outputs: None
  //Used for sending data input into our form to the database
  submitData(){

    var postBody : string;
    var postTitle : string;
    var postTopic : string;

    postBody = (<HTMLInputElement>document.getElementById("postBody")).value;
    postTitle = (<HTMLInputElement>document.getElementById("postTitle")).value;
    postTopic = (<HTMLInputElement>document.getElementById("postTopic")).value.toLowerCase();

    //Our properformat will be that each post must have at least a title, a body and at least 1 topic
    var properFormat = true;

    const data = {
      body: postBody,
      poster: this.username,
      likes: Array<String>(),
      title: postTitle,
      postTopic:postTopic
    };
    
    //For all of these we must change the alert to something like a redding of the text or an alert box
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
      history.back();
    }
  }
  
  //Inputs: None
  //Outputs: None
  //Use is to return to the homepage without having to deal with a bunch of event emitters
  close(){
    history.back();
  }
}
