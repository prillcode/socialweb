import { PostList } from "../components/PostList";

export const Home = () => {
  return (
    <div className="pt-10">
      <h3 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent">
        Dev Board
      </h3>
      <p className="text-center text-gray-500 mb-10">
        Welcome to the Dev Board! Here you can find all the latest posts from
        the Dev community.
      </p>
      <div className="flex justify-center mb-10">
        <span>Sign in to share your thoughts!</span>
      </div>
      <div>
        <PostList />
      </div>
    </div>
  );
};
