<?php
include('../../Conexion/DB.php');
// Asegúrate de que la ruta sea correcta según tu carpeta
$db = new DB('localhost', 'root', '', 'db_academica');

// Cambiamos a POST para evitar errores de URL larga
$accion = $_POST['accion'] ?? '';
$matriculas = json_decode($_POST['matriculas'] ?? '{}', true);

$resultado = false;

if($accion == 'nuevo'){
    $sql = "INSERT INTO matriculas (idMatricula, idAlumno, idMateria, idDocente, fecha, estado, periodo, gestion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $resultado = $db->consultaSQL($sql, 
        $matriculas['idMatricula'], $matriculas['idAlumno'], $matriculas['idMateria'], 
        $matriculas['idDocente'], $matriculas['fecha'], $matriculas['estado'],
        $matriculas['periodo'], $matriculas['gestion']
    );
} else if($accion == 'modificar'){
    $sql = "UPDATE matriculas SET idAlumno=?, idMateria=?, idDocente=?, fecha=?, estado=?, periodo=?, gestion=? WHERE idMatricula=?";
    $resultado = $db->consultaSQL($sql, 
        $matriculas['idAlumno'], $matriculas['idMateria'], $matriculas['idDocente'], 
        $matriculas['fecha'], $matriculas['estado'], $matriculas['periodo'], 
        $matriculas['gestion'], $matriculas['idMatricula']
    );
} else if($accion == 'eliminar'){
    $sql = "DELETE FROM matriculas WHERE idMatricula=?";
    $resultado = $db->consultaSQL($sql, $matriculas['idMatricula']);
}

// Devolvemos siempre un JSON para que el fetch no de error
echo json_encode($resultado);
?>