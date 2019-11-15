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
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { NewPostComponent } from './new-post/new-post.component';
import { PostContainerComponent } from './post-container/post-container.component';
import { RegistrationComponent } from './registration/registration.component';
import { UsernameCreatorComponent } from './username-creator/username-creator.component';
import { OpenPostComponent } from './open-post/open-post.component';


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
    AppComponent,
    NewPostComponent,
    PostContainerComponent,
    RegistrationComponent,
    UsernameCreatorComponent,
    OpenPostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(config),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
