<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    // 1. Clear database
    App\Models\Pasantia::query()->delete();
    App\Models\Empresa::query()->delete();

    // 2. Create Empresa
    $empresa = App\Models\Empresa::create([
        'nombre_empresa' => 'Microsoft',
        'nit' => '123456',
        'correo_contacto' => 'test@ms.com',
        'telefono' => '123',
        'soctor' => 'Tech',
        'direccion' => 'US'
    ]);

    // 3. Create Pasantia
    $pasantia = App\Models\Pasantia::create([
        'empresa_id' => $empresa->Id,
        'titulo' => 'Desarrollador',
        'descripcion' => 'Se busca dev',
        'habilidades_requeridas' => 'PHP',
        'duracion_meses' => '6 meses',
        'num_plazas' => 2
    ]);

    // 4. Search
    echo "Pasantías en DB: " . App\Models\Pasantia::count() . "\n";
    $request = Illuminate\Http\Request::create('/api/pasantias', 'GET', ['search' => 'Desarrollador']);
    $controller = new App\Http\Controllers\PasantiaController();
    $response = $controller->index($request);
    
    echo "JSON OUTPUT:\n" . $response->getContent() . "\n";

} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
