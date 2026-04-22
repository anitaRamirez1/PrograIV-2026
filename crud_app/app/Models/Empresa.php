<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    protected $primaryKey = 'Id';
    
    // Explicitly disabling timestamps if they weren't required by the original SQL, but keeping them since migration provided them it's fine.
    
    protected $fillable = ['nombre_empresa', 'nit', 'correo_contacto', 'telefono', 'soctor', 'direccion'];

    public function pasantias()
    {
        return $this->hasMany(Pasantia::class, 'empresa_id', 'Id');
    }
}
