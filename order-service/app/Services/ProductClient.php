<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class ProductClient
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = config('services.product_service.url', env('PRODUCT_SERVICE_URL', 'http://product-service:3000'));
    }

    public function getProduct(int $productId): array
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/products/{$productId}");

            if ($response->successful()) {
                return $response->json();
            }

            return ['error' => true, 'status' => $response->status(), 'message' => $response->json('message')];
        } catch (Exception $e) {
            return ['error' => true, 'status' => 503, 'message' => 'Product service tidak dapat dihubungi, coba lagi nanti'];
        }
    }
}