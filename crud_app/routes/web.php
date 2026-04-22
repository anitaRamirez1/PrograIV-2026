<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\PasantiaController;

Route::get('/', function () {
    return view('app');
});

Route::prefix('api')->group(function () {
    Route::apiResource('empresas', EmpresaController::class);
    Route::apiResource('pasantias', PasantiaController::class);
});
