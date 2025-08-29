<?php

namespace App\Http\Controllers\Publication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Publication;

class PublicationController extends Controller
{
    public function topFivePublications(Request $request)
    {
        $publications = Publication::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json($publications);
    }
}
