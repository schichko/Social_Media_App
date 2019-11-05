import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase/app'
import {
  AngularFirestore,
  AngularFirestoreModule,
  AngularFirestoreDocument,
  fromDocRef
} from '@angular/fire/firestore';


import { Post } from './post.model';
import { post } from 'selenium-webdriver/http';
@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.css']
})
export class PostContainerComponent implements OnInit {

  constructor(public afs: AngularFirestore) { }

  @Input()
  username: string;

  totalPosts : Post[] = new Array();
  blownUP : Post;
  
  ngOnInit() {
    this.getPosts().then(val => this.totalPosts = val);
  }

  async getPosts(){
    var tempPost : Post[] = new Array();
    const firestore = firebase.firestore();
    const snapshot = await firestore
      .collection("posts")
      .get()
    
  
    snapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
        //  console.log(doc.id, " => ", doc.data());
          // console.log(doc.id);
          // console.log(typeof(doc.id));
          const data = { 
            postID : doc.id,
            poster: doc.data().poster,
            title: doc.data().title,
            body: doc.data().body,
            //So we dont really need comments here so should find a way to remove this
            comments : doc.data().comments
          };
          tempPost.push(data);
          
          // console.log(doc.id, " => ", doc.data().body);
    });
    // console.log(tempPost);
    return tempPost;
  }

  blowUpPost(selectedPost : Post){

    this.getSinglePost(selectedPost.postID).then(val => this.blownUP = val);
    

  }

  async getSinglePost(postID:string){
    var myPost : Post;
    const firestore = firebase.firestore();


    //Possible change this to (IT WILL WORK THE SAME JUST SLIGHTLY FASTER)
    // db.collection('books').doc('fK3ddutEpD2qQqRMXNW5').get()

    // Then 

    // docRef.get().then(doc => {
    //   if (doc.exists) {
    //        console.log("Document data:", doc.data());
    //   } else {
    //        console.log("No such document!");
    //   }
    // }).catch(function(error) {
    //  console.log("Error getting document:", error);
    //       });
    const snapshot = await firestore
      .collection("posts")
      .where(firebase.firestore.FieldPath.documentId(), "==", postID)
      .get()
     

      // console.log("Gotten");
      
      snapshot.forEach(function(doc) {
      
        // doc.data() is never undefined for query doc snapshots
      //  console.log(doc.id, " => ", doc.data());
        // console.log(doc.id);
        // console.log(doc.data().poster);
        const data = { 
          postID : doc.id,
          poster: doc.data().poster,
          title: doc.data().title,
          body: doc.data().body,
          comments : doc.data().comments
        };
        myPost = data;
        
        // console.log(doc.id, " => ", doc.data().body);
    });


    // console.log("Gotten");
    
    // console.log(snapshot.get().data)


    //   console.log(snapshot.id);
    //   console.log(snapshot.data());
    //   const data = {
    //     postID : snapshot.id,
    //     poster: snapshot.data().poster,
    //     title: snapshot.data().title,
    //     body: snapshot.data().body
    //   }

    //   myPost = data;
   
    
    console.log(myPost.comments);
    return myPost;
  }

  closePost(){
    this.blownUP = null; 
  }

  postComment(){
    

    var today = new Date();
    var dateTime =  today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+":"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log("Hello World");
    var Inputs = document.getElementsByTagName("input");
    var commentBody : string;

    var properFormat = true;
    

    for(var i =0; i<Inputs.length;i++){
      switch(Inputs[i].id){
        case "commentBody":
          commentBody = Inputs[i].value;
          break;   
      }
    }

   // var postBody = document.getElementById("postBody").getElementsByTagName("input")[0].value;

    const data = {
      poster: this.username,
      commentTime : dateTime,
      commentBody: commentBody
    };

    if(commentBody == null ||commentBody == undefined){
      alert("Enter a post title");
      properFormat = false;
    }
   
    if(properFormat == true){
      this.afs.collection("posts").doc(this.blownUP.postID).update({
        "comments": firebase.firestore.FieldValue.arrayUnion(data)
      }); 
    }
    
  }

}
