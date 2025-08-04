<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Collection;

class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $collections = Collection::where('user_id', auth()->id())
                                 ->with('user')
                                 ->orderBy('created_at', 'desc') 
                                 ->get();

        return response()->json([
            'data' => $collections
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'is_public' => 'boolean',
            'slug' => 'nullable|string|max:255',
        ]);

        $collection = Collection::create([
            'user_id' => auth()->id(),
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'cover_image' => $request->input('cover_image'),
            'is_public' => $request->input('is_public', false),
            'slug' => $request->input('slug'),
        ]);

        return response()->json([
            'message' => 'Collection created successfully',
            'data' => $collection
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Logic to show a specific collection
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);

        // Ensure the collection belongs to the authenticated user
        if ($collection->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|string',
            'is_public' => 'boolean',
            'slug' => 'nullable|string|max:255',
        ]);

        $collection->update($request->only(['name', 'description', 'cover_image', 'is_public', 'slug']));

        return response()->json([
            'message' => 'Collection updated successfully',
            'data' => $collection
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $collection = Collection::findOrFail($id);

        // Ensure the collection belongs to the authenticated user
        if ($collection->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $collection->delete();

        return response()->json([
            'message' => 'Collection deleted successfully'
        ], 200);
    }
}
