<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Comment;
use App\Models\Article;

class CommentController extends Controller
{

    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'article_id' => 'required|exists:articles,id',
            'content' => 'required|string|max:1000',
        ]);

        $validatedData['user_id'] = auth()->user()->id;

        // Create a new comment
        $comment = Comment::create($validatedData);

        return response()->json([
            'message' => 'Comment created successfully',
            'comment' => $comment->load('user'),
        ], 201);
    }


    public function index($articleId)
    {
        // Fetch comments for the given article
        $comments = Comment::where('article_id', $articleId)->with('user')->get();

        return response()->json([
            'comments' => $comments,
        ]);
    }


    public function getCommentCount($slug)
    {
        $article = Article::where('slug', $slug)->firstOrFail();
        $commentCount = $article->comments()->count();
        $viewCount = $article->views()->count();

        return response()->json([
            'comment_count' => $commentCount,
            'view_count' => $viewCount,
        ]);
    }
}
