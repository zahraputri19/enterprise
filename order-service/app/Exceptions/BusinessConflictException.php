<?php

namespace App\Exceptions;

use Exception;

class BusinessConflictException extends Exception
{
    public function render($request)
    {
        return response()->json([
            'message' => $this->getMessage()
        ], 409);
    }
}