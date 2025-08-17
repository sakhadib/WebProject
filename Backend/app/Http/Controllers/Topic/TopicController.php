<?php

namespace App\Http\Controllers\Topic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Topic;

class TopicController extends Controller
{
    public function topTopics(Request $request)
    {
        $topics = Topic::withCount('articles')
            ->orderBy('articles_count', 'desc')
            ->take(10)
            ->get();

        return response()->json($topics);
    }

    public function index(Request $request)
    {
        $topics = Topic::all();
        return response()->json($topics);
    }
}
