<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\FollowerController;
use App\Http\Controllers\User\SocialMediaController;
use App\Http\Controllers\Article\CollectionController;
use App\Http\Controllers\Article\CategoryController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });


Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('register', [AuthController::class, 'register'])->name('api.register');
    Route::post('login', [AuthController::class, 'login'])->name('api.login');
    Route::post('logout', [AuthController::class, 'logout'])->name('api.logout');
    Route::post('refresh', [AuthController::class, 'refresh'])->name('api.refresh');
    Route::post('me', [AuthController::class, 'me'])->name('api.me');

});



Route::group([
    'middleware' => ['api'],
    'prefix' => 'user'

], function ($router) {

    Route::post('follow', [FollowerController::class, 'follow'])->name('api.user.follow');
    Route::post('unfollow', [FollowerController::class, 'unfollow'])->name('api.user.unfollow');
    Route::post('socialmedia/add', [SocialMediaController::class, 'create'])->name('api.user.social-media.create');
    Route::post('socialmedia/update/{id}', [SocialMediaController::class, 'update'])->name('api.user.social-media.update');
    Route::post('socialmedia/delete/{id}', [SocialMediaController::class, 'delete'])->name('api.user.social-media.delete');
});


Route::group([
    'middleware' => ['api'],
    'prefix' => 'article'

], function ($router) {

    Route::get('collections', [CollectionController::class, 'index'])->name('api.article.collections.index');
    Route::post('collections/add', [CollectionController::class, 'store'])->name('api.article.collections.store');
    Route::get('collections/show/{id}', [CollectionController::class, 'show'])->name('api.article.collections.show');
    Route::post('collections/update/{id}', [CollectionController::class, 'update'])->name('api.article.collections.update');
    Route::post('collections/delete/{id}', [CollectionController::class, 'destroy'])->name('api.article.collections.destroy');
});


Route::group([
    'middleware' => ['api'],
    'prefix' => 'article'
    // for admins
], function ($router) {
    Route::get('categories', [CategoryController::class, 'index'])->name('api.article.categories.index');
    Route::post('categories/add', [CategoryController::class, 'store'])->name('api.article.categories.store');
    Route::get('categories/show/{id}', [CategoryController::class, 'show'])->name('api.article.categories.show');
    Route::post('categories/update/{id}', [CategoryController::class, 'update'])->name('api.article.categories.update');
});



