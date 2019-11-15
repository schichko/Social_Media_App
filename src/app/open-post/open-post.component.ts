import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import * as firebase from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreModule,
  AngularFirestoreDocument,
  fromDocRef
} from '@angular/fire/firestore';
import {Post} from '../post-container/post.model'


@Component({
  selector: 'app-open-post',
  templateUrl: './open-post.component.html',
  styleUrls: ['./open-post.component.css']
})
export class OpenPostComponent implements OnInit {

  constructor(private route: ActivatedRoute,public afs: AngularFirestore) { }

  myPage : Post
  ngOnInit() {
    console.log(this.route.snapshot.paramMap.get("postID"));

    this.getSinglePost(this.route.snapshot.paramMap.get("postID")).then(val => this.myPage = val)
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
          comments : doc.data().comments,
          likes : postLikes,
          postID : doc.id,
          poster: doc.data().poster,
          title: doc.data().title
        };
        myPost = data;
        
    });

    return myPost;
  }


  closePost(){
    history.back();
  }
   //Input: None
  //Output: Nonoe
  //We Can send a comment to the selected posts database
  // postComment(){
    
  //   var today = new Date();
  //   var dateTime =  today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+":"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  //   var Inputs = document.getElementsByTagName("input");
  //   var commentBody : string;

  //   var properFormat = true;
    
  //   for(var i =0; i<Inputs.length;i++){
  //     switch(Inputs[i].id){
  //       case "commentBody":
  //         commentBody = Inputs[i].value;
  //         break;   
  //     }
  //   }

  //   const data = {
  //     poster: this.username,
  //     commentTime : dateTime,
  //     commentBody: commentBody
  //   };

  //   if(commentBody == null ||commentBody == undefined){
  //     alert("Enter a Comment");
  //     properFormat = false;
  //   }
   
  //   if(properFormat == true){
  //     this.afs.collection("posts").doc(this.slectedPost.postID).update({
  //       "comments": firebase.firestore.FieldValue.arrayUnion(data)
  //     }); 
  //   } 
  // }

}
