import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { db, getUserWithUsername } from "@/lib/firebase";
import {
  collection,
  limit,
  orderBy,
  where,
  query as fbquery,
  getDocs,
} from "firebase/firestore";

export async function getServerSideProps({ query }: any) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = fbquery(
      collection(userDoc.ref, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map((doc: any) => doc.data());
  }

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }: any) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
