import Link from "next/link";

export default function PostFeed({ posts, admin }: any) {
  return posts
    ? posts.map((post: any) => (
        <PostItem key={post.slug} post={post} admin={admin} />
      ))
    : null;
}
function PostItem({ post }: any) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <h2>{post.title} </h2>
      </Link>
      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span> ❤️ {post.heartCount || 0} Hearts</span>
      </footer>
    </div>
  );
}
