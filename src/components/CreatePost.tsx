import React, { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface PostInput {
  title: string;
  content: string;
  avatar_url: string | null;
}

const createPost = async (post: PostInput, imageFile: File | undefined) => {
  //set the image filePath if the imageFile is set
  const filePath = imageFile
    ? `${post.title}-${Date.now()}-${imageFile.name}`
    : null;

  //if filepath is set and imageFile isn't undefined - upload the image to supabase storage and insert the post with the Image included
  if (filePath && imageFile !== undefined) {
    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, imageFile);
    if (uploadError) throw new Error(uploadError.message);

    //save the post with the Image
    const { data: publicImageUrl } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);
    const { data: dataWImage, error } = await supabase
      .from("posts")
      .insert({ ...post, image_url: publicImageUrl.publicUrl });

    if (error) throw new Error(error.message);
    return dataWImage;
  } else {
    // No image included - so save the post without an Image
    const { data, error } = await supabase.from("posts").insert(post);

    if (error) throw new Error(error.message);
    return data;
  }
};

export const CreatePost = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const { user } = useAuth();

  const { mutate } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File | undefined }) => {
      return createPost(data.post, data.imageFile);
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    //insert into supabase 'posts' table
    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
      },
      imageFile: selectedFile,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          rows={5}
          required
        />
      </div>
      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-200"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-400 text-white px-4 py-2 rounded cursor-pointer"
      >
        {" "}
        Create Post
      </button>
    </form>
  );
};
