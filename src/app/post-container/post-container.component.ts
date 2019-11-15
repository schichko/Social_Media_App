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
    console.log(this.username);
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

        var postLikes = 0;
        if(doc.data().likes != "" && doc.data().likes != undefined){
          postLikes = doc.data().likes.length
        }

          const data = { 
            body: doc.data().body,
            likes: postLikes,
            postID : doc.id,
            poster: doc.data().poster,
            title: doc.data().title,
          };
          tempArrayOfPost.push(data);
    });

    return tempArrayOfPost;
  }

  //Input: A Selected Post
  //Output: None
  //Opens a user selected post and assigns it to the selected Post Value
  //This Also Emits the value of true for postSeleced Showing that some post was selected
  // openPost(){    
  //   this.notify.emit(true);
  // }

  //Input: None
  //Output: None
  //We Reset the selected post to nothing and let the app component know that it can start scrolling again by emitting that a post is no longer selected
  closePost(eventData: boolean){
    console.log("HERE")
    this.notify.emit(false);
  }

 
  //Input: Post that the User has liked
  //Output: None
  //Used to handle the async funtion to see if they have liked a post, if they have they unlike it and are removed from the liked array, if they havent they are added
  like(likedPost : Post){
    this.alreadyLiked(likedPost.postID,this.username,likedPost.likes).then(val => likedPost.likes = val);   
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


