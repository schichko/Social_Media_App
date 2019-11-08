
import {
  Component, 
  OnInit, 
  Input,
  EventEmitter,
  Output} from '@angular/core';
import * as firebase from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreModule,
  AngularFirestoreDocument,
  fromDocRef
} from '@angular/fire/firestore';
import { Post } from './post.model';

@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.css']
})
export class PostContainerComponent implements OnInit {

  constructor(public afs: AngularFirestore) { }

  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

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
          const data = { 
            postID : doc.id,
            poster: doc.data().poster,
            title: doc.data().title,
            body: doc.data().body,
            //So we dont really need comments here so should find a way to remove this
            comments : doc.data().comments
          };
          tempPost.push(data);
    });
    return tempPost;
  }

  blowUpPost(selectedPost : Post){
    
    this.getSinglePost(selectedPost.postID).then(val => this.blownUP = val);
    this.notify.emit(true);
  }

  async getSinglePost(postID:string){
    var myPost : Post;
    const firestore = firebase.firestore();

    const snapshot = await firestore
      .collection("posts")
      .where(firebase.firestore.FieldPath.documentId(), "==", postID)
      .get()
     

      // console.log("Gotten");
      
      snapshot.forEach(function(doc) {

        const data = { 
          postID : doc.id,
          poster: doc.data().poster,
          title: doc.data().title,
          body: doc.data().body,
          comments : doc.data().comments
        };
        myPost = data;
        
    });

    return myPost;
  }

  closePost(){
    this.blownUP = null; 
    this.notify.emit(false);
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
