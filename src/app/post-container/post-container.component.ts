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
  slectedPost : Post;
  
  //Input: None
  //Output: None
  //Gets the posts from an async function, what this means is that it works in parallel so as soon as its done it will change our total posts to getPosts() return value
  ngOnInit() {

    this.getPosts().then(val => this.totalPosts = val);
  }

  //Input: None
  //Output : Returns an Array of Type post that  we later assign to this.totalPostVals(Cant Assign this inside of an async) at least i never figured it out 
  async getPosts(){
    var tempArrayOfPost : Post[] = new Array();
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
          };
          tempArrayOfPost.push(data);
    });

    return tempArrayOfPost;
  }

  //Input: A Selected Post
  //Output: None
  //Opens a user selected post and assigns it to the selected Post Value
  //This Also Emits the value of true for postSeleced Showing that some post was selected
  openPost(selectedPost : Post){    
    this.getSinglePost(selectedPost.postID).then(val => this.slectedPost = val);
    this.notify.emit(true);
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

  //Input: None
  //Output: None
  //We Reset the selected post to nothing and let the app component know that it can start scrolling again by emitting that a post is no longer selected
  closePost(){
    this.slectedPost = null; 
    this.notify.emit(false);
  }

  //Input: None
  //Output: Nonoe
  //We Can send a comment to the selected posts database
  postComment(){
    
    var today = new Date();
    var dateTime =  today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate()+":"+today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
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
      alert("Enter a Comment");
      properFormat = false;
    }
   
    if(properFormat == true){
      this.afs.collection("posts").doc(this.slectedPost.postID).update({
        "comments": firebase.firestore.FieldValue.arrayUnion(data)
      }); 
    }
    
  }

}
