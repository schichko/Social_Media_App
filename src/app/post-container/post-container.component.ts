import {
  Component, 
  OnInit, 
  Input} from '@angular/core';
import * as firebase from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreModule,
  AngularFirestoreDocument,
  fromDocRef
} from '@angular/fire/firestore';
import { Post } from './post.model';
import { HostListener } from '@angular/core';
import {AuthService} from '../services/auth.service'

@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.css']
})
export class PostContainerComponent implements OnInit {

  constructor(public afs: AngularFirestore,public auth: AuthService) { 
    this.originalLocation = window.location.href;
    console.log(this.username);
  }

  @Input()
  username: string;

  originalLocation;


  @Input() set setTopic(topic:string){
    
    console.log("settingTopic")
    if(topic != undefined && topic != "" && topic != null){
      this.topic = topic;
      this.getTopicPost().then(val => this.totalPosts = val);
    }
    else{
      this.getPosts().then(val => this.totalPosts = val);
    }
  }
  
  // @HostListener('window:popstate', ['$event'])
  // onPopState(event) {
  //   console.log('Back button pressed');
  // }
  
  
  topic : string;

  totalPosts : Post[] = new Array();
  
   
  

  //Input: None
  //Output: None
  //Gets the posts from an async function, what this means is that it works in parallel so as soon as its done it will change our total posts to getPosts() return value
  ngOnInit() {  
    console.log(this.username);
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

        var postLikes = 0;
        if(doc.data().likes != "" && doc.data().likes != undefined){
          postLikes = doc.data().likes.length
        }

          const data = { 
            body: doc.data().body,
            numLikes : postLikes,
            postID : doc.id,
            poster: doc.data().poster,
            title: doc.data().title,
          };
          tempArrayOfPost.push(data);
    });

    return tempArrayOfPost;
  }


  async getTopicPost(){
    var tempArrayOfPost : Post[] = new Array();
    const firestore = firebase.firestore();
    const snapshot = await firestore
      .collection("posts")
      .where("postTopic","==",this.topic)
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
          title: doc.data().title,
        };
        tempArrayOfPost.push(data);
    });

    return tempArrayOfPost;
  }
 
  //Input: Post that the User has liked
  //Output: None
  //Used to handle the async funtion to see if they have liked a post, if they have they unlike it and are removed from the liked array, if they havent they are added
  like(likedPost : Post){
    this.alreadyLiked(likedPost.postID,this.username,likedPost.numLikes).then(val => likedPost.numLikes = val);   
  }

  //Input: PostID used for queriying the databse, Username: cannot use this.username in async, Likes: The current number of likes for this post
  //Output: Likes+1 or Likes-1 depending on if the user is liking or unliking
  //Queries the database for the list of likes and then checks if the user has already liked the message
  async alreadyLiked(postID:string,username:string,likes:number){
    
    var alreadyLiked = false;
    const firestore = firebase.firestore();
    const snapshot = await firestore
      .collection("posts")
      .where(firebase.firestore.FieldPath.documentId(), "==", postID)
      .get()
      snapshot.forEach(function(doc) {

        if(doc.data().likes.includes(username)){
          alreadyLiked = true;
        }
      });
      //Adds or removes user from the list of likes
    if(alreadyLiked == false){
      this.afs.collection("posts").doc(postID).update({
        "likes": firebase.firestore.FieldValue.arrayUnion(this.username)
      }); 
      likes ++;
      return likes;
    }
    else{
      this.afs.collection("posts").doc(postID).update({
        "likes": firebase.firestore.FieldValue.arrayRemove(this.username)
      }); 
      likes--;
      return likes;
    }
  
  }

  
}


