export interface Comment {
    commentId : string;
    commentTime: string;
    poster: string;
    commentBody: string;
    replies?:Array<Comment>;
}