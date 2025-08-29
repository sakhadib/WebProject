<?php

namespace App\Http\Controllers\Article;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Category;
use PDO;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Logic to retrieve and return categories
        $categories = Category::all();

        return response()->json([
            'data' => $categories
        ]);
    }

    public function mini(){
        $categories = Category::select('id', 'name')->get();
        return response()->json([
            'data' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'slug' => 'required|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
        ]);

        $category = Category::create($request->only(['name', 'slug', 'description', 'icon']));

        return response()->json([
            'message' => 'Category created successfully',
            'data' => $category
        ], 201);
    }


    public function show($id)
    {
        $category = Category::findOrFail($id);

        return response()->json([
            'data' => $category
        ]);
    }


    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $category->id,
            'slug' => 'sometimes|required|string|max:255|unique:categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
        ]);

        $category->update($request->only(['name', 'slug', 'description', 'icon']));

        return response()->json([
            'message' => 'Category updated successfully',
            'data' => $category
        ], 200);
    }
}
