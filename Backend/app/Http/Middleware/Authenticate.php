<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API requests, don't redirect - return null to trigger 401 response
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }
        
        // For web requests, you could redirect to a login page if you have one
        // For now, return null since this is primarily an API
        return null;
    }
}
