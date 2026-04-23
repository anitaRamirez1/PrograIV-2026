<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empresas', function (Blueprint $table) {
            $table->integer('Id', true); // INT(10) AUTO_INCREMENT PRIMARY KEY
            $table->string('nombre_empresa', 20);
            $table->string('nit', 20);
            $table->string('correo_contacto', 30);
            $table->string('telefono', 20);
            $table->string('soctor', 50); // Mantuve la escritura solicitada
            $table->string('direccion', 150);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
