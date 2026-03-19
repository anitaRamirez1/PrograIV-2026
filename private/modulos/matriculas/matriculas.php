<?php
include('../../Conexion/DB.php');
$db = new DB('localhost', 'root', '', 'db_academica');

$accion = $_GET['accion'];
$matriculas = json_decode($_GET['matriculas'], true);

if($accion == 'nuevo'){
    $sql = "INSERT INTO matriculas (idMatricula, idAlumno, idMateria, idDocente, fecha, estado, periodo, gestion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    echo json_encode($db->consultaSQL($sql, 
        $matriculas['idMatricula'], $matriculas['idAlumno'], $matriculas['idMateria'], 
        $matriculas['idDocente'], $matriculas['fecha'], $matriculas['estado'],
        $matriculas['periodo'], $matriculas['gestion']
    ));
} else if($accion == 'modificar'){
    $sql = "UPDATE matriculas SET idAlumno=?, idMateria=?, idDocente=?, fecha=?, estado=?, periodo=?, gestion=? WHERE idMatricula=?";
    echo json_encode($db->consultaSQL($sql, 
        $matriculas['idAlumno'], $matriculas['idMateria'], $matriculas['idDocente'], 
        $matriculas['fecha'], $matriculas['estado'], $matriculas['periodo'], 
        $matriculas['gestion'], $matriculas['idMatricula']
    ));
} else if($accion == 'eliminar'){
    $sql = "DELETE FROM matriculas WHERE idMatricula=?";
    echo json_encode($db->consultaSQL($sql, $matriculas['idMatricula']));
}
?>