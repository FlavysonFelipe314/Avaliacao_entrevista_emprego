<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->headers->get('Origin');
        
        $allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
        ];
        
        $allowedOrigin = in_array($origin, $allowedOrigins) ? $origin : null;
        
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 200);
            
            if ($allowedOrigin) {
                $response->header('Access-Control-Allow-Origin', $allowedOrigin);
                $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
                $response->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
                $response->header('Access-Control-Allow-Credentials', 'true');
                $response->header('Access-Control-Max-Age', '86400');
            }
            
            return $response;
        }
        
        $response = $next($request);

        if ($allowedOrigin) {
            $response->header('Access-Control-Allow-Origin', $allowedOrigin);
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            $response->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
            $response->header('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }
}

