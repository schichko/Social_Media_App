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
      
      var commentLikes = 0;
      if(doc.data().likes != "" && doc.data().likes != undefined){
        commentLikes = doc.data().likes.length
      }
      
      console.log(doc.data().comments);
      const data = { 
        commentTime: doc.data().commentTime,
        commentBody: doc.data().commentBody,
        commentId : doc.id,
        numLikes : commentLikes,
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
        commentBody: commentBody,
        likes:[]
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


  //Input: Post that the User has liked
  //Output: None
  //Used to handle the async funtion to see if they have liked a post, if they have they unlike it and are removed from the liked array, if they havent they are added
  likeComment(comment:Comment,username:string){
    this.alreadyLiked(comment.commentId,username,comment.numLikes).then(val => comment.numLikes = val);   
  }

  //Input: PostID used for queriying the databse, Username: cannot use this.username in async, Likes: The current number of likes for this post
  //Output: Likes+1 or Likes-1 depending on if the user is liking or unliking
  //Queries the database for the list of likes and then checks if the user has already liked the message
  async alreadyLiked(commentID:string,username:string,likes:number){
    console.log("In liking function")
    var alreadyLiked = false;
    const firestore = firebase.firestore();
    const snapshot = await firestore
      .collection("posts").doc(this.openPost.postID)
      .collection("comments")
      .where(firebase.firestore.FieldPath.documentId(), "==", commentID)
      .get()
      snapshot.forEach(function(doc) {
        console.log("AT least found the doc")
        console.log(firebase.firestore.FieldPath.documentId());
        console.log(commentID);
        console.log(doc.data().likes);

        if(doc.data().likes.includes(username)){
          alreadyLiked = true;
        }
      });
      //Adds or removes user from the list of likes
    console.log("Looking at already liked")
      console.log(alreadyLiked);
    if(alreadyLiked == false){
    
      this.afs.collection("posts").doc(this.openPost.postID)
      .collection("comments").doc(commentID).update({
        "likes": firebase.firestore.FieldValue.arrayUnion(username)
      }); 
      likes ++;
      console.log("Returning they havent already liked");
      return likes;
    }
    else{
      this.afs.collection("posts").doc(this.openPost.postID)
      .collection("comments").doc(commentID).update({
        "likes": firebase.firestore.FieldValue.arrayRemove(username)   
      }); 
      console.log("Returning they have already liked");
      likes--;
      return likes;
    }
  
  }
  
}
