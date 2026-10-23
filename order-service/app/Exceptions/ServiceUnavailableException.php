<?php

namespace App\Exceptions;

use Exception;

class ServiceUnavailableException extends Exception
{
    public function render($request)
    {
        return response()->json([
            'message' => $this->getMessage()
        ], 503);
    }
}