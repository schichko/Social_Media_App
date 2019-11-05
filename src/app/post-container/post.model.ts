export interface Post {
    postID : string;
    poster: string;
    comments : Array<Comment>;
    title: string;
    body: string;
}