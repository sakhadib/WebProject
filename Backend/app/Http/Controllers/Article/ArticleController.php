<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Models\Article;
use App\Models\User;
use App\Models\Category;
use App\Models\Topic;
use App\Models\View;

/**
 * Class ArticleController
 * 
 * Handles all article-related operations with comprehensive error handling
 * and edge case management.
 */
class ArticleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api')->except(['index', 'show', 'published', 'articlesByUsername', 'showByUsernameAndSlug']);
    }

    /**
     * Display a listing of published articles only (public endpoint)
     */
    public function index(Request $request)
    {
        try {
            $request->validate([
                'page' => 'sometimes|integer|min:1',
                'per_page' => 'sometimes|integer|min:1|max:100',
                'search' => 'sometimes|string|max:255',
                'category_id' => 'sometimes|integer|exists:categories,id',
                'sort' => 'sometimes|in:latest,oldest,title_asc,title_desc',
            ]);

            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');
            $categoryId = $request->input('category_id');
            $sort = $request->input('sort', 'latest');

            $query = Article::with(['user:id,username', 'category:id,name'])
                           ->published();

            // Apply filters
            if ($search) {
                $query->search($search);
            }

            if ($categoryId) {
                $query->byCategory($categoryId);
            }

            // Apply sorting
            switch ($sort) {
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'title_asc':
                    $query->orderBy('title', 'asc');
                    break;
                case 'title_desc':
                    $query->orderBy('title', 'desc');
                    break;
                default: // 'latest'
                    $query->orderBy('created_at', 'desc');
                    break;
            }

            $articles = $query->paginate($perPage);

            return response()->json([
                'message' => 'Published articles retrieved successfully',
                'data' => [
                    'articles' => $articles->items(),
                    'pagination' => [
                        'current_page' => $articles->currentPage(),
                        'per_page' => $articles->perPage(),
                        'total' => $articles->total(),
                        'last_page' => $articles->lastPage(),
                        'has_more_pages' => $articles->hasMorePages(),
                    ]
                ]
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'Invalid query parameters',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Retrieval failed',
                'message' => 'An unexpected error occurred while retrieving articles'
            ], 500);
        }
    }

    /**
     * Store a newly created article
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|json',
                'category_id' => 'sometimes|integer|exists:categories,id',
                'topics' => 'sometimes|string',
                'status' => 'sometimes|in:draft,published',
                'featured_image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            /** @var User $user */
            $user = auth('api')->user();

            $topics = array_map('trim', explode(',', $request->input('topics', '')));
            $topics = array_filter($topics);
            $topicIds = [];

            foreach ($topics as $topicName) {
                $topic = Topic::firstOrCreate(['name' => $topicName, 'slug' => Str::slug($topicName)]);
                $topicIds[] = $topic->id;
            }

            // Handle featured image upload
            $featuredImagePath = null;
            if ($request->hasFile('featured_image')) {
                $image = $request->file('featured_image');
                $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $featuredImagePath = $image->storeAs('articles/featured', $imageName, 'public');
            }

            $article = Article::create([
                'user_id' => $user->id,
                'title' => $request->input('title'),
                'content' => $request->input('content'),
                'category_id' => $request->input('category_id'),
                'slug' => Str::slug(Str::limit($request->input('title'), 100, '')) . '-' . time(),
                'excerpt' => $request->input('excerpt'),
                'status' => $request->input('status', 'draft'),
                'featured_image' => $featuredImagePath,
            ]);

            // Attach topics to the article
            if (!empty($topicIds)) {
                $article->topics()->attach($topicIds);
            }

            return response()->json([
                'message' => 'Article created successfully',
                'data' => [
                    'article' => $article->load(['user:id,username,email', 'category:id,name', 'topics:id,name'])
                ]
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'Invalid input data',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Creation failed',
                'message' => 'An unexpected error occurred while creating the article'
            ], 500);
        }
    }

    /**
     * Display the specified article (public endpoint)
     */
    public function show($slug)
    {
        try {
            $article = Article::with(['user:id,username,email,avatar', 'category:id,name'])
                             ->where('slug', $slug)
                             ->published()
                             ->firstOrFail();

            View::create(['article_id' => $article->id]);

            return response()->json([
                'message' => 'Article retrieved successfully',
                'data' => [
                    'article' => $article
                ]
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Article not found',
                'message' => 'The specified article does not exist or is not published'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Retrieval failed',
                'message' => 'An unexpected error occurred while retrieving the article'
            ], 500);
        }
    }


    public function updateShow($slug){
        $article = Article::with(['user:id,username,email,avatar', 'category:id,name'])
                          ->where('slug', $slug)
                          ->firstOrFail();

        if ($article->user_id !== auth('api')->user()->id) {
            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'You can only update your own articles'
            ], 403);
        }

        return response()->json([
            'message' => 'Article retrieved successfully',
            'data' => [
                'article' => $article
            ]
        ], 200);
    }

    /**
     * Update the specified article
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'title' => 'sometimes|string|max:255',
                'content' => 'sometimes|string',
                'category_id' => 'sometimes|integer|exists:categories,id|nullable',
                'slug' => 'sometimes|string|max:255|unique:articles,slug,' . $id,
                'excerpt' => 'sometimes|string|max:500',
                'status' => 'sometimes|in:draft,published,deleted',
                'featured_image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            /** @var User $user */
            $user = auth('api')->user();
            
            $article = Article::findOrFail($id);

            // Check if user owns the article
            if ($article->user_id !== $user->id) {
                return response()->json([
                    'error' => 'Unauthorized',
                    'message' => 'You can only update your own articles'
                ], 403);
            }

            $updateData = $request->only([
                'title', 'content', 'category_id', 'slug', 'excerpt', 'status'
            ]);

            // Handle featured image upload
            if ($request->hasFile('featured_image')) {
                // Delete old image if exists
                if ($article->featured_image && Storage::disk('public')->exists($article->featured_image)) {
                    Storage::disk('public')->delete($article->featured_image);
                }

                $image = $request->file('featured_image');
                $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('articles/featured', $imageName, 'public');
                $updateData['featured_image'] = $imagePath;
            }

            $article->update($updateData);

            return response()->json([
                'message' => 'Article updated successfully',
                'data' => [
                    'article' => $article->load(['user:id,username,email', 'category:id,name'])
                ]
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'Invalid input data',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Article not found',
                'message' => 'The specified article does not exist'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Update failed',
                'message' => 'An unexpected error occurred while updating the article'
            ], 500);
        }
    }

    /**
     * Remove the specified article
     */
    public function destroy($id)
    {
        try {
            /** @var User $user */
            $user = auth('api')->user();
            
            $article = Article::findOrFail($id);

            // Check if user owns the article
            if ($article->user_id !== $user->id) {
                return response()->json([
                    'error' => 'Unauthorized',
                    'message' => 'You can only delete your own articles'
                ], 403);
            }

            // Delete featured image if exists
            if ($article->featured_image && Storage::disk('public')->exists($article->featured_image)) {
                Storage::disk('public')->delete($article->featured_image);
            }

            $article->delete();

            return response()->json([
                'message' => 'Article deleted successfully'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Article not found',
                'message' => 'The specified article does not exist'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Deletion failed',
                'message' => 'An unexpected error occurred while deleting the article'
            ], 500);
        }
    }

    /**
     * Get articles by authenticated user
     */
    public function myArticles(Request $request)
    {
        try {
            $request->validate([
                'page' => 'sometimes|integer|min:1',
                'per_page' => 'sometimes|integer|min:1|max:100',
                'status' => 'sometimes|in:draft,published,deleted',
                'search' => 'sometimes|string|max:255',
            ]);

            /** @var User $user */
            $user = auth('api')->user();
            $perPage = $request->input('per_page', 15);
            $status = $request->input('status');
            $search = $request->input('search');

            $query = Article::with(['category:id,name', 'user:id,username,email,avatar'])
                            ->withCount(['views', 'comments'])
                            ->where('user_id', $user->id);

            if ($status) {
                $query->byStatus($status);
            }

            if ($search) {
                $query->search($search);
            }

            $query->orderBy('created_at', 'desc');

            $articles = $query->paginate($perPage);

            return response()->json([
                'message' => 'Your articles retrieved successfully',
                'data' => [
                    'articles' => $articles->items(),
                    'pagination' => [
                        'current_page' => $articles->currentPage(),
                        'per_page' => $articles->perPage(),
                        'total' => $articles->total(),
                        'last_page' => $articles->lastPage(),
                        'has_more_pages' => $articles->hasMorePages(),
                    ],
                    'stats' => [
                        'total_articles' => Article::where('user_id', $user->id)->count(),
                        'published_articles' => Article::where('user_id', $user->id)->published()->count(),
                        'draft_articles' => Article::where('user_id', $user->id)->draft()->count(),
                    ]
                ]
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'Invalid query parameters',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Retrieval failed',
                'message' => 'An unexpected error occurred while retrieving your articles'
            ], 500);
        }
    }

    /**
     * Publish an article
     */
    public function publish($id)
    {
        try {
            /** @var User $user */
            $user = auth('api')->user();
            
            $article = Article::findOrFail($id);

            // Check if user owns the article
            if ($article->user_id !== $user->id) {
                return response()->json([
                    'error' => 'Unauthorized',
                    'message' => 'You can only publish your own articles'
                ], 403);
            }

            if ($article->isPublished()) {
                return response()->json([
                    'error' => 'Already published',
                    'message' => 'Article is already published'
                ], 409);
            }

            $article->publish();

            return response()->json([
                'message' => 'Article published successfully',
                'data' => [
                    'article' => $article->load(['user:id,username,email', 'category:id,name'])
                ]
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Article not found',
                'message' => 'The specified article does not exist'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Publish failed',
                'message' => 'An unexpected error occurred while publishing the article'
            ], 500);
        }
    }

    /**
     * Make an article draft
     */
    public function makeDraft($id)
    {
        try {
            /** @var User $user */
            $user = auth('api')->user();
            
            $article = Article::findOrFail($id);

            // Check if user owns the article
            if ($article->user_id !== $user->id) {
                return response()->json([
                    'error' => 'Unauthorized',
                    'message' => 'You can only modify your own articles'
                ], 403);
            }

            if ($article->isDraft()) {
                return response()->json([
                    'error' => 'Already draft',
                    'message' => 'Article is already a draft'
                ], 409);
            }

            $article->makeDraft();

            return response()->json([
                'message' => 'Article moved to draft successfully',
                'data' => [
                    'article' => $article->load(['user:id,username,email', 'category:id,name'])
                ]
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Article not found',
                'message' => 'The specified article does not exist'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Draft operation failed',
                'message' => 'An unexpected error occurred while moving article to draft'
            ], 500);
        }
    }

    /**
     * Get published articles (public endpoint)
     */
    public function published(Request $request)
    {
        try {
            $request->validate([
                'page' => 'sometimes|integer|min:1',
                'per_page' => 'sometimes|integer|min:1|max:50',
                'search' => 'sometimes|string|max:255',
                'category_id' => 'sometimes|integer|exists:categories,id',
            ]);

            $perPage = $request->input('per_page', 12);
            $search = $request->input('search');
            $categoryId = $request->input('category_id');

            $query = Article::with(['user:id,username,email,avatar', 'category:id,name'])
                           ->published();

            if ($search) {
                $query->search($search);
            }

            if ($categoryId) {
                $query->byCategory($categoryId);
            }

            $query->orderBy('created_at', 'desc');

            $articles = $query->paginate($perPage);

            return response()->json([
                'message' => 'Published articles retrieved successfully',
                'data' => [
                    'articles' => $articles->items(),
                    'pagination' => [
                        'current_page' => $articles->currentPage(),
                        'per_page' => $articles->perPage(),
                        'total' => $articles->total(),
                        'last_page' => $articles->lastPage(),
                        'has_more_pages' => $articles->hasMorePages(),
                    ]
                ]
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'Invalid query parameters',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Retrieval failed',
                'message' => 'An unexpected error occurred while retrieving published articles'
            ], 500);
        }
    }

    /**
     * Get all articles by username (public endpoint)
     */
    public function articlesByUsername(Request $request, $username)
    {
        try {
            $request->validate([
                'page' => 'sometimes|integer|min:1',
                'per_page' => 'sometimes|integer|min:1|max:100',
                'search' => 'sometimes|string|max:255',
                'category_id' => 'sometimes|integer|exists:categories,id',
                'status' => 'sometimes|in:draft,published',
                'sort' => 'sometimes|in:latest,oldest,title_asc,title_desc',
            ]);

            // Find user by username
            $user = User::where('username', $username)->first();

            if (!$user) {
                return response()->json([
                    'error' => 'User not found',
                    'message' => 'The specified user does not exist'
                ], 404);
            }

            $perPage = $request->input('per_page', 15);
            $search = $request->input('search');
            $categoryId = $request->input('category_id');
            $status = $request->input('status');
            $sort = $request->input('sort', 'latest');

            $query = Article::with(['user:id,username,email,avatar', 'category:id,name'])
                           ->where('user_id', $user->id);

            // Check if requesting user is the same as the profile user
            $authenticatedUser = auth('api')->user();
            $isOwnProfile = $authenticatedUser && $authenticatedUser->id === $user->id;

            // If not own profile, only show published articles
            if (!$isOwnProfile) {
                $query->published();
            } else {
                // If own profile and status specified, filter by status
                if ($status) {
                    $query->byStatus($status);
                }
            }

            // Apply filters
            if ($search) {
                $query->search($search);
            }

            if ($categoryId) {
                $query->byCategory($categoryId);
            }

            // Apply sorting
            switch ($sort) {
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                case 'title_asc':
                    $query->orderBy('title', 'asc');
                    break;
                case 'title_desc':
                    $query->orderBy('title', 'desc');
                    break;
                default: // 'latest'
                    $query->orderBy('created_at', 'desc');
                    break;
            }

            $articles = $query->paginate($perPage);

            $response = [
                'message' => "Articles by {$user->username} retrieved successfully",
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'username' => $user->username,
                        'email' => $user->email,
                    ],
                    'articles' => $articles->items(),
                    'pagination' => [
                        'current_page' => $articles->currentPage(),
                        'per_page' => $articles->perPage(),
                        'total' => $articles->total(),
                        'last_page' => $articles->lastPage(),
                        'has_more_pages' => $articles->hasMorePages(),
                    ]
                ]
            ];

            // Add stats if viewing own profile
            if ($isOwnProfile) {
                $response['data']['stats'] = [
                    'total_articles' => Article::where('user_id', $user->id)->count(),
                    'published_articles' => Article::where('user_id', $user->id)->published()->count(),
                    'draft_articles' => Article::where('user_id', $user->id)->draft()->count(),
                ];
            }

            return response()->json($response, 200);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'Invalid query parameters',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Retrieval failed',
                'message' => 'An unexpected error occurred while retrieving user articles'
            ], 500);
        }
    }

    /**
     * Get a specific article by username and slug (public endpoint)
     */
    public function showByUsernameAndSlug($username, $slug)
    {
        try {
            // Find user by username
            $user = User::where('username', $username)->first();

            if (!$user) {
                return response()->json([
                    'error' => 'User not found',
                    'message' => 'The specified user does not exist'
                ], 404);
            }

            // Check if requesting user is the same as the article owner
            $authenticatedUser = auth('api')->user();
            $isOwnProfile = $authenticatedUser && $authenticatedUser->id === $user->id;

            $query = Article::with(['user:id,username,email', 'category:id,name'])
                           ->where('slug', $slug)
                           ->where('user_id', $user->id);

            // If not own profile, only show published articles
            if (!$isOwnProfile) {
                $query->published();
            }

            $article = $query->first();

            if (!$article) {
                return response()->json([
                    'error' => 'Article not found',
                    'message' => 'The specified article does not exist or is not accessible'
                ], 404);
            }

            return response()->json([
                'message' => 'Article retrieved successfully',
                'data' => [
                    'article' => $article
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Retrieval failed',
                'message' => 'An unexpected error occurred while retrieving the article'
            ], 500);
        }
    }


    /**
     * Get all the drafts by me
     */
    public function getDraftsByMe()
    {
        try {
            $user = auth('api')->user();

            $drafts = Article::where('user_id', $user->id)
                ->where('status', 'draft')
                ->with(['user:id,username,email,avatar', 'category:id,name'])
                ->get();

            return response()->json([
                'message' => 'Draft articles retrieved successfully',
                'data' => [
                    'drafts' => $drafts
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Retrieval failed',
                'message' => 'An unexpected error occurred while retrieving draft articles'
            ], 500);
        }
    }
}
