<?php
header('Content-Type: application/json; charset=utf-8');
include('../../Conexion/DB.php');
$db = new DB('localhost', 'root', '', 'db_academica');

$accion = $_REQUEST['accion'] ?? '';
$alumnos = json_decode($_REQUEST['alumnos'] ?? '{}', true);

try {
    if($accion == 'nuevo'){
        $sql = "INSERT INTO alumnos (idAlumno, codigo, nombre, direccion, email, telefono) VALUES (?, ?, ?, ?, ?, ?)";
        $resultado = $db->consultaSQL($sql, 
            $alumnos['idAlumno'], $alumnos['codigo'], $alumnos['nombre'], 
            $alumnos['direccion'], $alumnos['email'], $alumnos['telefono']
        );
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion == 'modificar'){
        $sql = "UPDATE alumnos SET codigo=?, nombre=?, direccion=?, email=?, telefono=? WHERE idAlumno=?";
        $resultado = $db->consultaSQL($sql, 
            $alumnos['codigo'], $alumnos['nombre'], $alumnos['direccion'], 
            $alumnos['email'], $alumnos['telefono'], $alumnos['idAlumno']
        );
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion == 'eliminar'){
        $sql = "DELETE FROM alumnos WHERE idAlumno=?";
        $resultado = $db->consultaSQL($sql, $alumnos['idAlumno']);
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion == 'consultar'){
        $sql = "SELECT idAlumno, codigo, nombre, direccion, email, telefono FROM alumnos";
        $db->consultaSQL($sql);
        echo json_encode($db->obtener_datos());
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Fatal Exception: ' . $e->getMessage()]);
}
?>