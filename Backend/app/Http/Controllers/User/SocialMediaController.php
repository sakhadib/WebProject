<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\SocialMedia;
use Illuminate\Http\Request;

class SocialMediaController extends Controller
{

    public function create(Request $request)
    {
        $request->validate([
            'platform' => 'required|string|max:255',
            'handle' => 'required|string|max:255|unique:social_media,handle',
            'url' => 'nullable|url|max:255',
        ]);

        $socialMedia = SocialMedia::create([
            'user_id' => auth()->id(),
            'platform' => $request->input('platform'),
            'handle' => $request->input('handle'),
            'url' => $request->input('url'),
        ]);

        return response()->json([
            'message' => 'Social media created successfully',
            'data' => $socialMedia
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $socialMedia = SocialMedia::findOrFail($id);

        // Ensure the social media belongs to the authenticated user
        if ($socialMedia->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'platform' => 'sometimes|required|string|max:255',
            'handle' => 'sometimes|required|string|max:255|unique:social_media,handle,' . $socialMedia->id,
            'url' => 'nullable|url|max:255',
        ]);

        $socialMedia->update($request->only(['platform', 'handle', 'url']));

        return response()->json([
            'message' => 'Social media updated successfully',
            'data' => $socialMedia
        ], 200);
    }


    public function delete($id)
    {
        $socialMedia = SocialMedia::findOrFail($id);

        // Ensure the social media belongs to the authenticated user
        if ($socialMedia->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $socialMedia->delete();

        return response()->json([
            'message' => 'Social media deleted successfully'
        ], 200);
    }
    
}
