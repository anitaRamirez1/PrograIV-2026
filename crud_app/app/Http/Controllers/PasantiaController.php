<?php

namespace App\Http\Controllers;

use App\Models\Pasantia;
use Illuminate\Http\Request;

class PasantiaController extends Controller
{
    public function index(Request $request)
    {
        $query = Pasantia::with('empresa');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('titulo', 'like', "%{$search}%")
                  ->orWhere('descripcion', 'like', "%{$search}%");
        }

        return response()->json($query->orderBy('Id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'empresa_id' => 'required|exists:empresas,Id',
            'titulo' => 'required|string|max:20',
            'descripcion' => 'required|string|max:1500',
            'habilidades_requeridas' => 'required|string|max:50',
            'duracion_meses' => 'required|string|max:40',
            'num_plazas' => 'required|integer',
        ]);

        $pasantia = Pasantia::create($validated);
        return response()->json(Pasantia::with('empresa')->find($pasantia->Id), 201);
    }

    public function show($id)
    {
        $pasantia = Pasantia::with('empresa')->findOrFail($id);
        return response()->json($pasantia);
    }

    public function update(Request $request, $id)
    {
        $pasantia = Pasantia::findOrFail($id);
        
        $validated = $request->validate([
            'empresa_id' => 'required|exists:empresas,Id',
            'titulo' => 'required|string|max:20',
            'descripcion' => 'required|string|max:1500',
            'habilidades_requeridas' => 'required|string|max:50',
            'duracion_meses' => 'required|string|max:40',
            'num_plazas' => 'required|integer',
        ]);

        $pasantia->update($validated);
        return response()->json(Pasantia::with('empresa')->find($pasantia->Id));
    }

    public function destroy($id)
    {
        $pasantia = Pasantia::findOrFail($id);
        $pasantia->delete();
        return response()->json(null, 204);
    }
}
