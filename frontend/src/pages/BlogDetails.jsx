import React, { useState } from "react";
import blogPosts from "./../data/singlePostData";
import { useParams } from "react-router-dom";
import Comment from "../components/singleComment";

// Main Blog Post Component
const BlogPost = () => {
  let { id } = useParams(); // TODO: Fetch data using this id. - Mainul
  const post = blogPosts.find((post) => post.id === parseInt(id)); // using demo for now - Mainul
  if (!post) {
    return <div>Post not found.</div>; // TODO: Design kora lagbe shundor not found page
  }

  // Destructure the post object to get your data
  const {
    category,
    readTime,
    publishDate,
    title,
    author,
    featuredImage,
    featuredImageCaption,
    content,
    likes,
    comments,
    totalComments,
    relatedArticles,
  } = post;

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-12">
          {/* Category and Reading Time */}
          <div className="flex items-center space-x-2 mb-6">
            <span className="inline-block px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
              {category}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-500">{readTime}</span>
            <span className="text-gray-500">•</span>
            <time className="text-sm text-gray-500">{publishDate}</time>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-black mb-8 leading-tight font-medium">
            {title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-8">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-gray-900">{author.name}</div>
              <div className="text-sm text-gray-600">{author.title}</div>
            </div>
            <div className="flex-1"></div>
            <button className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors duration-200 text-sm font-medium">
              Follow
            </button>
          </div>

          {/* Featured Image */}
          <div className="mb-12">
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-96 object-cover rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              {featuredImageCaption}
            </p>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">{content}</article>

        {/* Article Footer */}
        <footer className="border-t border-gray-200 pt-8 mt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{likes} likes</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>{totalComments} comments</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Share this article</span>
              <button className="text-gray-600 hover:text-black transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-black transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* Comments Section */}
      <CommentsSection comments={comments} totalComments={totalComments} />

      {/* Related Articles */}
      <RelatedArticles articles={relatedArticles} authorName={author.name} />
    </div>
  );
};

// Usage example
export default BlogPost;

// Comments Section Component
const CommentsSection = ({ comments = [], totalComments = 0 }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (newComment.trim()) {
      // Handle comment submission
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-black mb-8">
        Comments ({totalComments})
      </h3>

      {/* Comment Form */}
      <div className="mb-12">
        <div className="flex space-x-4">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
            alt="You"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              rows="4"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </div>

      {/* Load More Comments */}
      {comments.length < totalComments && (
        <div className="text-center mt-8">
          <button className="text-gray-600 hover:text-black transition-colors duration-200 font-medium">
            Show more comments
          </button>
        </div>
      )}
    </section>
  );
};

// Related Articles Component
const RelatedArticles = ({ articles = [], authorName }) => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-black mb-8">
        More from {authorName}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((article, index) => (
          <article key={index} className="group cursor-pointer">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
            <h4 className="text-lg font-semibold text-black group-hover:text-gray-700 transition-colors duration-200 mb-2">
              {article.title}
            </h4>
            <p className="text-gray-600 text-sm">{article.description}</p>
            <div className="flex items-center space-x-2 mt-3 text-xs text-gray-500">
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
