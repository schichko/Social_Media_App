import { Component, OnInit } from '@angular/core';
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

  totalPosts : Post[] = new Array();

  ngOnInit() {
    this.getPosts().then(val => this.totalPosts = val);
   // this.getPosts();
 

    //console.log(this.totalPosts);
    // var snapshot = 
    // snapshot.forEach(function(doc) {
    //       // doc.data() is never undefined for query doc snapshots
    //       console.log(doc.id, " => ", doc.data());
    //       const data = {
    //         poster: doc.data().poster,
    //         title:    // this.msg();
    // console.log("HERE");doc.data().title,
    //         body: doc.data().body
    //       };
    //       tempPost.push(data);
    //       console.log(doc.id, " => ", doc.data().body);
    // });tempPost.push(data);
  }

  // scaryClown() {
  //   return new Promise(resolve => {
  //     setTimeout(() => {
  //       resolve('🤡');
  //     }, 2000);
  //   });
  // }
  
  // async  msg() {
  //   const msg = await this.scaryClown();
  //   console.log('Message:', msg);
  // }

  async getPosts(){
    var tempPost : Post[] = new Array();
    const firestore = firebase.firestore();
    const snapshot = await firestore
      .collection("posts")
      .get()
    
    snapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
        //  console.log(doc.id, " => ", doc.data());
          const data = {
            poster: doc.data().poster,
            title: doc.data().title,
            body: doc.data().body
          };
          tempPost.push(data);
          
          // console.log(doc.id, " => ", doc.data().body);
    });
    // console.log(tempPost);
    return tempPost;
  }
}
