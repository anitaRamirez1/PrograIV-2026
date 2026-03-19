<?php
header('Content-Type: application/json; charset=utf-8');
include('../../Conexion/DB.php');
$db = new DB('localhost', 'root', '', 'db_academica');

$accion = $_REQUEST['accion'] ?? '';
$materias = json_decode($_REQUEST['materias'] ?? '{}', true);

try {
    if($accion == 'nuevo'){
        $sql = "INSERT INTO materias (idMateria, codigo, nombre, uv) VALUES (?, ?, ?, ?)";
        $resultado = $db->consultaSQL($sql, 
            $materias['idMateria'], $materias['codigo'], $materias['nombre'], $materias['uv']
        );
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion == 'modificar'){
        $sql = "UPDATE materias SET codigo=?, nombre=?, uv=? WHERE idMateria=?";
        $resultado = $db->consultaSQL($sql, 
            $materias['codigo'], $materias['nombre'], $materias['uv'], $materias['idMateria']
        );
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion == 'eliminar'){
        $sql = "DELETE FROM materias WHERE idMateria=?";
        $resultado = $db->consultaSQL($sql, $materias['idMateria']);
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion == 'consultar'){
        $sql = "SELECT idMateria, codigo, nombre, uv FROM materias";
        $db->consultaSQL($sql);
        echo json_encode($db->obtener_datos());
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Fatal Exception: ' . $e->getMessage()]);
}
?>