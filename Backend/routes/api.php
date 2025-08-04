<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\FollowerController;
use App\Http\Controllers\User\SocialMediaController;
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