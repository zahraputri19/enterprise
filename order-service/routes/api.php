<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;

// 1. Route Health Check
Route::get('/health', function () {
    return response()->json([
        'status'  => 'ok',
        'service' => 'order-service'
    ], 200);
});

// 2. Route Orders (Daftar spesifik user ditaruh SEBELUM detail ID)
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/user/{userId}', [OrderController::class, 'userOrders']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::patch('/orders/{id}/pay', [OrderController::class, 'pay']);