<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class CartClient
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.cart_service.url', env('CART_SERVICE_URL', 'http://cart-service:3001'));
    }

    public function getCart(int $userId): array
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/carts/{$userId}");

            if ($response->successful()) {
                return $response->json();
            }

            return ['error' => true, 'status' => $response->status(), 'message' => $response->json('message')];
        } catch (Exception $e) {
            return ['error' => true, 'status' => 503, 'message' => 'Cart service tidak dapat dihubungi, coba lagi nanti'];
        }
    }

    public function clearCart(int $userId): bool
    {
        try {
            $response = Http::timeout(5)->delete("{$this->baseUrl}/carts/{$userId}");
            return $response->successful();
        } catch (Exception $e) {
            return false;
        }
    }
}