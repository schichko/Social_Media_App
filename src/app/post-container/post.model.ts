export interface Post {
    comments? : Array<Comment>;
    body: string;
    likes: number;
    postID : string;
    poster: string;
    title: string;
}