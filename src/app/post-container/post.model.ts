export interface Post {
    comments? : Array<Comment>;
    body: string;
    likes?: Array<String>;
    numLikes: number;
    postID : string;
    poster: string;
    title: string;
}