<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    protected OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function store(StoreOrderRequest $request)
    {
        $order = $this->orderService->checkout($request->user_id);

        return response()->json([
            'message' => 'Pesanan berhasil dibuat',
            'data'    => $order
        ], 201);
    }

    public function show($id)
    {
        if (!is_numeric($id)) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json([
                'message' => "Pesanan dengan id {$id} tidak ditemukan"
            ], 404);
        }

        return response()->json([
            'message' => 'Berhasil mengambil pesanan',
            'data'    => $order
        ], 200);
    }

    public function userOrders(Request $request, $userId)
    {
        if (!is_numeric($userId)) {
            return response()->json(['message' => 'User ID tidak valid'], 422);
        }

        if ($request->has('status')) {
            $validator = Validator::make($request->all(), [
                'status' => 'in:PENDING,PAID',
            ], [
                'status.in' => 'Status harus PENDING atau PAID',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Data yang dikirim tidak valid',
                    'errors'  => $validator->errors()
                ], 422);
            }
        }

        $query = Order::with('items')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json([
            'message' => 'Berhasil mengambil daftar pesanan',
            'data'    => $query->get()
        ], 200);
    }

    public function pay($id)
    {
        if (!is_numeric($id)) {
            return response()->json(['message' => 'Pesanan tidak ditemukan'], 404);
        }

        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json([
                'message' => "Pesanan dengan id {$id} tidak ditemukan"
            ], 404);
        }

        if ($order->status !== 'PENDING') {
            return response()->json([
                'message' => "Pesanan berstatus {$order->status}, hanya pesanan PENDING yang dapat dibayar"
            ], 409);
        }

        $order->update(['status' => 'PAID']);

        return response()->json([
            'message' => 'Pesanan berhasil dibayar',
            'data'    => $order->fresh('items')
        ], 200);
    }
}