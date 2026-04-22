<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use Illuminate\Http\Request;

class EmpresaController extends Controller
{
    public function index(Request $request)
    {
        $query = Empresa::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('nombre_empresa', 'like', "%{$search}%")
                  ->orWhere('nit', 'like', "%{$search}%");
        }

        return response()->json($query->orderBy('Id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre_empresa' => 'required|string|max:20',
            'nit' => 'required|string|max:20',
            'correo_contacto' => 'required|email|max:30',
            'telefono' => 'required|string|max:20',
            'soctor' => 'required|string|max:50',
            'direccion' => 'required|string|max:150',
        ]);

        $empresa = Empresa::create($validated);
        return response()->json($empresa, 201);
    }

    public function show($id)
    {
        $empresa = Empresa::findOrFail($id);
        return response()->json($empresa);
    }

    public function update(Request $request, $id)
    {
        $empresa = Empresa::findOrFail($id);
        $validated = $request->validate([
            'nombre_empresa' => 'required|string|max:20',
            'nit' => 'required|string|max:20',
            'correo_contacto' => 'required|email|max:30',
            'telefono' => 'required|string|max:20',
            'soctor' => 'required|string|max:50',
            'direccion' => 'required|string|max:150',
        ]);

        $empresa->update($validated);
        return response()->json($empresa);
    }

    public function destroy($id)
    {
        $empresa = Empresa::findOrFail($id);
        $empresa->delete();
        return response()->json(null, 204);
    }
}
