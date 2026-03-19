<?php
require_once __DIR__ . '/../../Conexion/DB.php';

class Inscripcion {
    private $conn;
    
    public function __construct() {
        // Pasar los parámetros que requiere DB: server, user, pass, base
        $database = new DB('localhost', 'root', '', 'db_academica');
        $this->conn = $database; // Guardamos la instancia de DB, no la conexión PDO directamente
    }
    
    // Obtener todas las inscripciones con datos relacionados
    public function getAll() {
        $sql = "SELECT i.*, 
                       a.nombre as alumno_nombre, 
                       a.apellido as alumno_apellido,
                       m.nombre as materia_nombre, 
                       m.codigo as materia_codigo
                FROM inscripciones i
                INNER JOIN alumnos a ON i.idAlumno = a.idAlumno
                INNER JOIN materias m ON i.idMateria = m.idMateria
                ORDER BY i.fecha DESC";
        
        $this->conn->consultaSQL($sql);
        return $this->conn->obtener_datos();
    }
    
    // Crear nueva inscripción
    public function create($idAlumno, $idMateria, $fecha) {
        // Verificar si ya existe la inscripción
        if ($this->existeInscripcion($idAlumno, $idMateria)) {
            return ['error' => 'El alumno ya está inscrito en esta materia'];
        }
        
        $sql = "INSERT INTO inscripciones (idAlumno, idMateria, fecha) 
                VALUES (?, ?, ?)";
        
        $resultado = $this->conn->consultaSQL($sql, $idAlumno, $idMateria, $fecha);
        
        if ($resultado) {
            // Obtener el último ID insertado (esto puede variar según tu DB)
            $this->conn->consultaSQL("SELECT LAST_INSERT_ID() as id");
            $id = $this->conn->obtener_datos();
            return ['success' => true, 'id' => $id[0]['id']];
        }
        return ['error' => 'Error al crear la inscripción'];
    }
    
    // Actualizar inscripción
    public function update($id, $idAlumno, $idMateria, $fecha) {
        $sql = "UPDATE inscripciones 
                SET idAlumno = ?, 
                    idMateria = ?, 
                    fecha = ? 
                WHERE idInscripcion = ?";
        
        $resultado = $this->conn->consultaSQL($sql, $idAlumno, $idMateria, $fecha, $id);
        
        if ($resultado) {
            return ['success' => true];
        }
        return ['error' => 'Error al actualizar la inscripción'];
    }
    
    // Eliminar inscripción
    public function delete($id) {
        $sql = "DELETE FROM inscripciones WHERE idInscripcion = ?";
        $resultado = $this->conn->consultaSQL($sql, $id);
        
        if ($resultado) {
            return ['success' => true];
        }
        return ['error' => 'Error al eliminar la inscripción'];
    }
    
    // Verificar si existe inscripción duplicada
    private function existeInscripcion($idAlumno, $idMateria) {
        $sql = "SELECT COUNT(*) as total FROM inscripciones 
                WHERE idAlumno = ? AND idMateria = ?";
        
        $this->conn->consultaSQL($sql, $idAlumno, $idMateria);
        $result = $this->conn->obtener_datos();
        return $result[0]['total'] > 0;
    }
    
    // Obtener alumnos para dropdown
    public function getAlumnos() {
        $sql = "SELECT idAlumno, nombre, apellido FROM alumnos ORDER BY apellido, nombre";
        $this->conn->consultaSQL($sql);
        return $this->conn->obtener_datos();
    }
    
    // Obtener materias para dropdown
    public function getMaterias() {
        $sql = "SELECT idMateria, nombre, codigo FROM materias ORDER BY nombre";
        $this->conn->consultaSQL($sql);
        return $this->conn->obtener_datos();
    }
}
?>