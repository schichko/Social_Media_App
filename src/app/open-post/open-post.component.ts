import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service'
import { ActivatedRoute } from "@angular/router";
import * as firebase from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreModule,
  AngularFirestoreDocument,
  fromDocRef
} from '@angular/fire/firestore';
import {Post} from '../post-container/post.model'
import {Comment} from '../post-container/comment.model'

@Component({
  selector: 'app-open-post',
  templateUrl: './open-post.component.html',
  styleUrls: ['./open-post.component.css']
})
export class OpenPostComponent implements OnInit {

  constructor(private route: ActivatedRoute,public afs: AngularFirestore,public auth: AuthService) { }

  openPost : Post
  openPostComments : Array<Comment>

  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get("postID"));

    this.getSinglePost(this.route.snapshot.paramMap.get("postID")).then(val => this.openPost = val)
    this.getComments(this.route.snapshot.paramMap.get("postID")).then(val => this.openPostComments = val)
  }

  //Input the ID of the post (The ID is a randomly generated value by firebase)
  //Output: The Selected Post as a single post
  //Similarly the get SinglePost function works almost the same as the get post function except it only gets one based on the value passed in as postID
  async getSinglePost(postID:string){
    var myPost : Post;
    const firestore = firebase.firestore();

    const snapshot = await firestore
      .collection("posts")
      .where(firebase.firestore.FieldPath.documentId(), "==", postID)
      .get()
      
      snapshot.forEach(function(doc) {
        
        var postLikes = 0;
        if(doc.data().likes != "" && doc.data().likes != undefined){
          postLikes = doc.data().likes.length
        }
      
        const data = { 
          body: doc.data().body,
          numLikes : postLikes,
          postID : doc.id,
          poster: doc.data().poster,
          title: doc.data().title
        };
        myPost = data;
        
    });

    return myPost;
  }

  async getComments(postID:string){
    var myComments = new Array<Comment>()

    const firestore = firebase.firestore();
    const snapshot = await firestore
    .collection("posts").doc(postID)
    .collection("comments")
    .get()
    
    snapshot.forEach(function(doc) {
      
      var postLikes = 0;
      if(doc.data().likes != "" && doc.data().likes != undefined){
        postLikes = doc.data().likes.length
      }
      
      console.log(doc.data().comments);
      const data = { 
        commentTime: doc.data().commentTime,
        commentBody: doc.data().commentBody,
        commentId : doc.id,
        poster: doc.data().poster,
        replies: doc.data().replies
      };

      myComments.push(data);
      
  });
    console.log(myComments);
    return myComments;
  }


  closePost(){
    history.back();
  }
  //Input: None
  //Output: None
  //We Can send a comment to the selected posts database
  postComment(username:string){
    console.log(username);
    
    var today = new Date();
    var dateTime =  today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+":"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


    var commentBody : string;
    commentBody = (<HTMLInputElement>document.getElementById("commentBody")).value;


    var properFormat = true;
    
    if(commentBody == null ||commentBody == undefined){
      alert("Enter a Comment");
      properFormat = false;
    }
  
    else if(properFormat == true){
      const data = {
        //Have to change this to username
        poster: username,
        commentTime : dateTime,
        commentBody: commentBody
      };

      this.afs.collection("posts").doc(this.openPost.postID).collection("comments").add(
        data
      ); 
    } 
  }

  replyToComment(commentId:string,username:string){
    var commentReply = (<HTMLInputElement>document.getElementById("commentReply")).value;
    var today = new Date();

    var dateTime =  today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+":"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const data = {
      commentBody : (<HTMLInputElement>document.getElementById("commentReply")).value,
      commentTime : dateTime,
      poster : username
    }

    this.afs.collection("posts").doc(this.openPost.postID).collection("comments").doc(commentId).update({
     "replies":firebase.firestore.FieldValue.arrayUnion(data)
    }); 
  }
  
}
