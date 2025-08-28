<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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


    public function updateProfilePicture(Request $request)
    {
        try {
            $request->validate([
                'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            /** @var User $user */
            $user = auth('api')->user();

            if (!$user) {
                return response()->json([
                    'error' => 'User not found',
                    'message' => 'Authentication required'
                ], 401);
            }

            // Delete old avatar if exists
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Handle the new avatar upload
            $image = $request->file('avatar');
            $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('avatars', $imageName, 'public');

            // Update the user's avatar
            $user->avatar = $imagePath;
            $user->save();

            return response()->json([
                'message' => 'Profile picture updated successfully',
                'data' => [
                    'avatar_url' => Storage::url($imagePath),
                    'avatar_path' => $imagePath
                ]
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'Invalid image file',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Upload failed',
                'message' => 'An unexpected error occurred while updating profile picture'
            ], 500);
        }
    }


    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'first_name' => 'nullable|string|max:50',
                'last_name' => 'nullable|string|max:50',
                'bio' => 'nullable|string|max:500',
            ]);

            /** @var User $user */
            $user = auth('api')->user();

            if (!$user) {
                return response()->json([
                    'error' => 'User not found',
                    'message' => 'Authentication required'
                ], 401);
            }

            // Update user profile fields
            $user->first_name = $request->input('first_name', $user->first_name);
            $user->last_name = $request->input('last_name', $user->last_name);
            $user->bio = $request->input('bio', $user->bio);
            $user->save();

            return response()->json([
                'message' => 'Profile updated successfully',
                'data' => $user
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'message' => 'Invalid profile data',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Update failed',
                'message' => 'An unexpected error occurred while updating profile'
            ], 500);
        }
    }
}
