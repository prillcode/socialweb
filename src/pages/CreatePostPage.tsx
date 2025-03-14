import { CreatePost } from "../components/CreatePost";

export const CreatePostPage = () => {
  return (
    <div className="pt-10">
      <h2 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent">
        New Post
      </h2>
      <CreatePost />
    </div>
  );
};
