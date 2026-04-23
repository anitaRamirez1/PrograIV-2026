<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pasantias', function (Blueprint $table) {
            $table->integer('Id', true); // INT(10) AUTO_INCREMENT PRIMARY KEY
            $table->integer('empresa_id')->index(); // INT(55)
            $table->string('titulo', 20);
            $table->string('descripcion', 1500);
            $table->string('habilidades_requeridas', 50);
            $table->string('duracion_meses', 40);
            $table->integer('num_plazas'); // INT(70)
            
            // Relacion constraint
            $table->foreign('empresa_id')->references('Id')->on('empresas')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pasantias');
    }
};
