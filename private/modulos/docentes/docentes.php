<?php
header('Content-Type: application/json; charset=utf-8');
include('../../Conexion/DB.php');
$db = new DB('localhost', 'root', '', 'db_academica');

$accion = $_REQUEST['accion'] ?? '';
$docentes = json_decode($_REQUEST['docentes'] ?? '{}', true);

try {
    if($accion === 'nuevo'){
        $sql = "INSERT INTO docentes (Id_Docentes, codigo, nombre, direccion, email, telefono, escalafon) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $resultado = $db->consultaSQL($sql,
            $docentes['idDocente'], $docentes['codigo'], $docentes['nombre'], 
            $docentes['direccion'], $docentes['email'], $docentes['telefono'], 
            $docentes['escalafon']
        );
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion === 'modificar'){
        $sql = "UPDATE docentes SET codigo = ?, nombre = ?, direccion = ?, email = ?, telefono = ?, escalafon = ? WHERE Id_Docentes = ?";
        $resultado = $db->consultaSQL($sql, 
            $docentes['codigo'], $docentes['nombre'], $docentes['direccion'], 
            $docentes['email'], $docentes['telefono'], $docentes['escalafon'], 
            $docentes['idDocente']
        );
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion === 'eliminar'){
        $sql = "DELETE FROM docentes WHERE Id_Docentes = ?";
        // el JS manda el uuid en string directo "docentes=abc-..."? no, JS manda JSON.
        // Wait, "eliminarDocente" in docentes.js doesn't actually exist!
        // wait, busqueda_docentes.js has 'eliminarDocente' which DOES NOT fetch to backend! 
        // It only deletes locally! Oh no, the user app is missing the remote delete for docentes.
        // I will implement the correct sql execution assuming JS will send JSON
        $resultado = $db->consultaSQL($sql, $docentes['idDocente']);
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion === 'consultar'){
        // Crucial fix: return 'Id_Docentes' as 'idDocente' to align with Vue/Dexie expectations
        $sql = "SELECT Id_Docentes as idDocente, codigo, nombre, direccion, email, telefono, escalafon FROM docentes";
        $db->consultaSQL($sql);
        echo json_encode($db->obtener_datos());
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Fatal Exception: ' . $e->getMessage()]);
}
?>