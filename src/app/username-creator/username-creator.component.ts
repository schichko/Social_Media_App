import { Component, OnInit, Input } from '@angular/core';

import * as firebase from 'firebase/app';

import {
  AngularFirestore,
  AngularFirestoreModule,
  AngularFirestoreDocument,
  fromDocRef
} from '@angular/fire/firestore';

@Component({
  selector: 'app-username-creator',
  templateUrl: './username-creator.component.html',
  styleUrls: ['./username-creator.component.css']
})
export class UsernameCreatorComponent implements OnInit {

  @Input()
  userID : string

  constructor(public afs: AngularFirestore) { }

  ngOnInit() {
  }

  logUser(){
    this.checkAndUpdate("Harambe")
  }

  async checkAndUpdate(desiredName:string){
    var count = 0; 
    const firestore = firebase.firestore();
    const snapshot = await firestore

    .collection("users")
    .where(firebase.firestore.FieldPath.documentId(), "==", desiredName)
    .get()
      snapshot.forEach(function(doc) {
        count++;
      });
    


    if(count ==0){
      firestore.collection("users").doc(desiredName).set({
        "username":desiredName
      });
    }




  }
}
