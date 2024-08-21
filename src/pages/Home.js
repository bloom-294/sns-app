import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../SessionProvider";
import { Navigate } from "react-router-dom";
import { SideMenu } from "../components/SideMenu.js"
import { postRepository } from "../repositories/post.js";
import { Post } from "../components/Post.js";
import { Pagination } from "../components/Pagination.js";

const limit = 5;

const Home = () => {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const { currentUser } = useContext(SessionContext);

  const createPost = async() => {
    const post = await postRepository.create(content, currentUser.id);
    setPosts([
      { ...post, userId: currentUser.id, userName: currentUser.userName },
      ...posts,
    ]);
    setContent("");
  }

  const fetchPosts = async(page) => {
    const posts = await postRepository.find(page, limit);
    setPosts(posts);
  }

  const moveToNext = async() => {
    const nextPage = page + 1;
    await fetchPosts(nextPage);
    setPage(nextPage);
  }

  const moveToPrev = async() => {
    const prevPage = page - 1;
    await fetchPosts(prevPage);
    setPage(prevPage);
  }

  const deletePost = async(postId) => {
    await postRepository.delete(postId);
    setPosts(posts.filter((post) => post.id !== postId ))
  }

  useEffect(() => {
    fetchPosts();
  },[]);

  if(currentUser == null) return <Navigate replace to="/signin" />;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-8">
        <div className="container mx-auto flex items-center justify-between px-5">
          <h1 className="text-3xl font-bold text-[#726E68]">SNS&nbsp;APP</h1>
          <button className="text-[#726E68] text-md hover:text-red-800">ログアウト</button>
        </div>
      </header>
      <div className="container mx-auto mt-6 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-gray-200 rounded-md"
                placeholder="What's on your mind?"
                value={content}
              />
              <button 
                onClick={createPost}
                className="bg-[#726E68] text-white px-4 py-2 rounded-md hover:opacity-80 focus:outline-none  focus:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={content === ""}
              >
                Post
              </button>
            </div>
            <div className="mt-4">
              {posts.map((post) => (
                <Post key={post.id} post={post} onDelete={deletePost} />
              ))}
            </div>
              <Pagination 
              onPrev={page > 1 ? moveToPrev : null} 
              onNext={posts.length >= limit ? moveToNext : null} />
          </div>
          <SideMenu />
        </div>
      </div>
    </div>
  );
}

export default Home;
