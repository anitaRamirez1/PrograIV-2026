<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$pasantias = App\Models\Pasantia::all();
echo "All Pasantias:\n";
foreach($pasantias as $p) {
    echo "ID: {$p->Id} | Titulo: '{$p->titulo}' | Empresa: {$p->empresa_id}\n";
}

$search = "a"; // I will simulate what could fail
$q = App\Models\Pasantia::with('empresa')->where(function($q) use ($search) {
    $q->where('titulo', 'like', "%{$search}%")
      ->orWhere('descripcion', 'like', "%{$search}%")
      ->orWhereHas('empresa', function($qEmp) use ($search) {
          $qEmp->where('nombre_empresa', 'like', "%{$search}%");
      });
});
echo "Search 'a' results: " . $q->count() . "\n";
