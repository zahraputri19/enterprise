<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Exceptions\ServiceUnavailableException;
use App\Exceptions\BusinessConflictException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderService
{
    protected CartClient $cartClient;
    protected ProductClient $productClient;

    public function __construct(CartClient $cartClient, ProductClient $productClient)
    {
        $this->cartClient = $cartClient;
        $this->productClient = $productClient;
    }

    public function checkout(int $userId): Order
    {
        // 1. Ambil data keranjang dari cart-service
        $cartResponse = $this->cartClient->getCart($userId);

        if (isset($cartResponse['error'])) {
            if ($cartResponse['status'] === 503) {
                throw new ServiceUnavailableException('Cart service tidak dapat dihubungi, coba lagi nanti');
            }
            throw new BusinessConflictException($cartResponse['message'] ?? 'Gagal mengambil keranjang');
        }

        $cartItems = $cartResponse['data']['items'] ?? [];

        if (empty($cartItems)) {
            throw new BusinessConflictException('Keranjang belanja kosong');
        }

        // 2. Validasi setiap produk ke product-service
        $preparedItems = [];
        $totalAmount = 0;

        foreach ($cartItems as $cartItem) {
            $productId = $cartItem['product_id'];
            $requestedQty = $cartItem['quantity'];

            $productResponse = $this->productClient->getProduct($productId);

            if (isset($productResponse['error'])) {
                if ($productResponse['status'] === 503) {
                    throw new ServiceUnavailableException('Product service tidak dapat dihubungi, coba lagi nanti');
                }
                throw new BusinessConflictException("Produk dengan ID {$productId} tidak ditemukan");
            }

            $productData = $productResponse['data'];
            $productName = $productData['name'];
            $availableStock = $productData['stock'];
            $unitPrice = (float) $productData['price'];

            if ($availableStock < $requestedQty) {
                throw new BusinessConflictException("Stok {$productName} tidak mencukupi: diminta {$requestedQty}, tersedia {$availableStock}");
            }

            $subtotal = $unitPrice * $requestedQty;
            $totalAmount += $subtotal;

            $preparedItems[] = [
                'product_id' => $productId,
                'product_name' => $productName,
                'unit_price' => $unitPrice,
                'quantity' => $requestedQty,
                'subtotal' => $subtotal,
            ];
        }

        // 3. Simpan pesanan dalam transaksi database (snapshot harga & nama)
        $order = DB::transaction(function () use ($userId, $totalAmount, $preparedItems) {
            $order = Order::create([
                'user_id' => $userId,
                'status' => 'PENDING',
                'total_amount' => $totalAmount,
            ]);

            foreach ($preparedItems as $item) {
                $order->items()->create($item);
            }

            return $order;
        });

        // 4. Minta cart-service mengosongkan keranjang
        $cleared = $this->cartClient->clearCart($userId);
        if (!$cleared) {
            Log::warning("Gagal mengosongkan keranjang untuk user_id: {$userId} setelah pesanan #{$order->id} dibuat.");
        }

        return $order->load('items');
    }
}