import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OpenPostComponent} from './open-post/open-post.component'
import {NewPostComponent} from './new-post/new-post.component'
import {AppComponent} from './app.component'

const routes: Routes = [
  { path: "post/:postID", component: OpenPostComponent },
  { path: "newPost/:username", component:NewPostComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
