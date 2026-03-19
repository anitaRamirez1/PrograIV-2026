<?php
header('Content-Type: application/json; charset=utf-8');
include('../../Conexion/DB.php');
$db = new DB('localhost', 'root', '', 'db_academica');

$accion = $_REQUEST['accion'] ?? '';
$matriculas = json_decode($_REQUEST['matriculas'] ?? '{}', true);

try {
    if($accion == 'nuevo'){
        $sql = "INSERT INTO matriculas (idMatricula, idAlumno, idMateria, idDocente, fecha, estado, periodo, gestion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $resultado = $db->consultaSQL($sql, 
            $matriculas['idMatricula'], $matriculas['idAlumno'], $matriculas['idMateria'], 
            $matriculas['idDocente'], $matriculas['fecha'], $matriculas['estado'],
            $matriculas['periodo'], $matriculas['gestion']
        );
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion == 'modificar'){
        $sql = "UPDATE matriculas SET idAlumno=?, idMateria=?, idDocente=?, fecha=?, estado=?, periodo=?, gestion=? WHERE idMatricula=?";
        $resultado = $db->consultaSQL($sql, 
            $matriculas['idAlumno'], $matriculas['idMateria'], $matriculas['idDocente'], 
            $matriculas['fecha'], $matriculas['estado'], $matriculas['periodo'], 
            $matriculas['gestion'], $matriculas['idMatricula']
        );
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion == 'eliminar'){
        $sql = "DELETE FROM matriculas WHERE idMatricula=?";
        $resultado = $db->consultaSQL($sql, $matriculas['idMatricula']);
        if (is_string($resultado)) echo json_encode(['error' => $resultado]);
        else echo json_encode(true);
    } else if($accion == 'consultar'){
        $sql = "SELECT idMatricula, idAlumno, idMateria, idDocente, fecha, estado, periodo, gestion FROM matriculas";
        $db->consultaSQL($sql);
        echo json_encode($db->obtener_datos());
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Fatal Exception: ' . $e->getMessage()]);
}
?>