<?php
include('../././Conexion/DB.php');
$db = new db();

$accion = isset($_GET['accion']) ? $_GET['accion'] : '';
$datos = isset($_GET['inscripciones']) ? json_decode($_GET['inscripciones'], true) : array();

header('Content-Type: application/json');

if ($accion == 'consultar') {
    $resultado = $db->consultar("SELECT * FROM inscripciones");
    echo json_encode($resultado);

} else if ($accion == 'nuevo') {
    $sql = "INSERT INTO inscripciones (idInscripcion, idAlumno, idMateria, fecha, estado) VALUES (
        '{$datos['idInscripcion']}',
        '{$datos['idAlumno']}',
        '{$datos['idMateria']}',
        '{$datos['fecha']}',
        '{$datos['estado']}'
    )";
    
    $resultado = $db->ejecutar($sql);
    echo json_encode($resultado);

} else if ($accion == 'modificar') {
    $sql = "UPDATE inscripciones SET 
        idAlumno = '{$datos['idAlumno']}',
        idMateria = '{$datos['idMateria']}',
        fecha = '{$datos['fecha']}',
        estado = '{$datos['estado']}'
        WHERE idInscripcion = '{$datos['idInscripcion']}'";
    
    $resultado = $db->ejecutar($sql);
    echo json_encode($resultado);

} else if ($accion == 'eliminar') {
    $sql = "DELETE FROM inscripciones WHERE idInscripcion = '{$datos['idInscripcion']}'";
    
    $resultado = $db->ejecutar($sql);
    echo json_encode($resultado);

} else {
    echo json_encode(['error' => 'Acción no válida']);
}
?>