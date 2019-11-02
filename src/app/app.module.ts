import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

const config = {
  apiKey: "AIzaSyACpCRhfpeXTiHVaHfi9os1HnTagNXtb8A",
    authDomain: "schichko-socialmedia.firebaseapp.com",
    databaseURL: "https://schichko-socialmedia.firebaseio.com",
    projectId: "schichko-socialmedia",
    storageBucket: "schichko-socialmedia.appspot.com",
    messagingSenderId: "911522461726",
    appId: "1:911522461726:web:a3c62a4c979a3a2c09160f",
    measurementId: "G-92LCLBPP0Y"
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
