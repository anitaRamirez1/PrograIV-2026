<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pasantia extends Model
{
    use HasFactory;

    protected $primaryKey = 'Id';
    public $timestamps = false;
    
    protected $fillable = ['empresa_id', 'titulo', 'descripcion', 'habilidades_requeridas', 'duracion_meses', 'num_plazas'];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id', 'Id');
    }
}
