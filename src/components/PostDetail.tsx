import { useQuery } from "@tanstack/react-query";
import { Post } from "./PostList";
import { supabase } from "../supabase-client";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) return <div> Loading post...</div>;
  if (error) {
    return <div> Error: {error.message}</div>;
  }

  return (
    /* make max width of containing div 920px and center contents horizontally on page */
    <div className="flex justify-center">
      <div className="space-y-6 w-[920px]">
        <h3 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent">
          {data?.title}
        </h3>
        {/* Only add the image if data.image_url is set */}
        {data?.image_url && (
          <img
            src={data?.image_url}
            alt={data?.title}
            className="w-full mb-4 object-cover h-120 rounded-[50px]"
          />
        )}
        <p className="text-gray-400">{data?.content}</p>
        <p className="text-gray-600">
          Posted on: {new Date(data!.created_at).toLocaleDateString()}{" "}
        </p>
      </div>
    </div>
  );
};
