export default function UserProfile({ user }: any) {
  return (
    <div className="box-center">
      <img src={user?.photoURL || "../../public/hacker.png"} className="card-img-center" />
      <p>
        <i>@{user?.username || "Anon"}</i>
      </p>
      <h1>{user?.displayName || "Anonymous User"}</h1>
    </div>
  );
}
