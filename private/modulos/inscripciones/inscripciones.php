<?php
header('Content-Type: application/json; charset=utf-8');
include('../../Config/Config.php');
extract($_REQUEST);

$inscripciones = $inscripciones ?? '{}';
$accion = $accion ?? '';

$class_inscripcion = new inscripcion($conexion);
echo json_encode($class_inscripcion->recibir_datos($inscripciones));

class inscripcion{
    private $datos = [], $db, $respuesta=['msg'=>'ok'];

    public function __construct($conexion){
        $this->db = $conexion;
    }
    public function recibir_datos($inscripciones){
        global $accion;
        if($accion==='consultar'){
            return $this->administrar_inscripciones();
        }else{
            $this->datos = json_decode($inscripciones, true);
            return $this->validar_datos();
        }
    }
    private function validar_datos(){
        if(empty($this->datos['idAlumno'])){
            $this->respuesta['msg'] = 'El alumno es requerido';
        }
        if(empty($this->datos['idMateria'])){
            $this->respuesta['msg'] = 'La materia es requerida';
        }
        if(empty($this->datos['fecha'])){
            $this->respuesta['msg'] = 'La fecha es requerida';
        }
        return $this->administrar_inscripciones();
    }
    private function administrar_inscripciones(){
        global $accion;
        if($this->respuesta['msg']!=='ok'){
           return $this->respuesta;
        }
        
        $resultado = null;
        
        try {
            if($accion==='nuevo'){
                $resultado = $this->db->consultaSQL('INSERT INTO inscripciones (idAlumno, idMateria, fecha) VALUES (?, ?, ?)',
                $this->datos['idAlumno'], $this->datos['idMateria'], $this->datos['fecha']);
            }else if($accion==='modificar'){
                $resultado = $this->db->consultaSQL('UPDATE inscripciones SET idAlumno = ?, idMateria = ?, fecha = ? WHERE idInscripcion = ?',
                $this->datos['idAlumno'], $this->datos['idMateria'], $this->datos['fecha'], $this->datos['idInscripcion']);
            }else if($accion==='eliminar'){
                $resultado = $this->db->consultaSQL('
                    DELETE FROM inscripciones 
                    WHERE idInscripcion = ?
                ',$this->datos['idInscripcion']);
            }else if($accion==='consultar'){
                $this->db->consultaSQL('
                    SELECT i.*, 
                           a.nombre as alumno_nombre, 
                           m.nombre as materia_nombre, 
                           m.codigo as materia_codigo
                    FROM inscripciones i
                    INNER JOIN alumnos a ON i.idAlumno = a.idAlumno
                    INNER JOIN materias m ON i.idMateria = m.idMateria
                    ORDER BY i.fecha DESC
                ');
                return $this->db->obtener_datos();
            }
            
            // Si DB.php nos retorna un string porque catcheó un error.
            if (is_string($resultado)) {
                return ['error' => $resultado];
            }
            return true;
            
        } catch (Exception $e) {
            return ['error' => 'Excepción en PHP: ' . $e->getMessage()];
        }
    }
}
?>