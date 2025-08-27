<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Collection;

class ProfileController extends Controller
{
    public function profile($username)
    {
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user);
    }


    public function collections($username){

        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $collections = Collection::where('user_id', $user->id)
                                 ->where('is_public', true)
                                 ->with('user')
                                 ->orderBy('created_at', 'desc') 
                                 ->get();

        return response()->json([
            'data' => $collections
        ]);
    }
}
