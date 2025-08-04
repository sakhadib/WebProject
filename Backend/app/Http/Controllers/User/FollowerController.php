<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Follower;
use Illuminate\Http\Request;

use App\Models\User;

class FollowerController extends Controller
{
    public function follow(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $me = auth()->user();
        $user = User::findOrFail($request->input('user_id'));

        // Check if the user is trying to follow themselves
        if ($me->id === $user->id) {
            return response()->json([
                'error' => 'Invalid action',
                'message' => 'You cannot follow yourself'
            ], 400);
        }

        // Check if the user is already followed
        $following = Follower::where('follower_id', $me->id)
            ->where('followed_id', $user->id)
            ->first();

        if ($following) {
            return response()->json([
                'error' => 'Already following',
                'message' => 'You are already following this user'
            ], 400);
        }

        // Create the follow relationship
        Follower::create([
            'follower_id' => $me->id,
            'followed_id' => $user->id
        ]);

        return response()->json([
            'message' => 'Successfully followed user',
            'user_id' => $user->id
        ], 200);
    }

    public function unfollow(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $me = auth()->user();
        $user = User::findOrFail($request->input('user_id'));

        // Check if the user is trying to unfollow themselves
        if ($me->id === $user->id) {
            return response()->json([
                'error' => 'Invalid action',
                'message' => 'You cannot unfollow yourself'
            ], 400);
        }

        // Check if the user is currently followed
        $following = Follower::where('follower_id', $me->id)
            ->where('followed_id', $user->id)
            ->first();

        if (!$following) {
            return response()->json([
                'error' => 'Not following',
                'message' => 'You are not following this user'
            ], 400);
        }

        // Delete the follow relationship
        $following->delete();

        return response()->json([
            'message' => 'Successfully unfollowed user',
            'user_id' => $user->id
        ], 200);
    }
}
