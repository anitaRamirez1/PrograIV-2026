<?php
header('Content-Type: application/json');
require_once '../conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombres = trim($_POST['nombres'] ?? '');
    $apellidos = trim($_POST['apellidos'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if(empty($nombres) || empty($apellidos) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos requeridos.']);
        exit;
    }

    if (!preg_match('/^[a-zA-Z0-9._%+-]+@ugb\.edu\.sv$/i', $email)) {
        echo json_encode(['success' => false, 'message' => 'El correo debe ser institucional (ejemplo: usss000000@ugb.edu.sv).']);
        exit;
    }

    try {
        // 1. Check if the student actually exists in the `estudiante` table.
        // We assume they must use their institutional email which is stored in `correo_secundario`.
        $stmtEstudiante = $pdo->prepare("SELECT id FROM estudiante WHERE correo_secundario = ?");
        $stmtEstudiante->execute([$email]);
        $estudianteExiste = $stmtEstudiante->fetch();

        if (!$estudianteExiste) {
            echo json_encode(['success' => false, 'message' => 'No se encontró tu correo en la base de datos de estudiantes activos. Verifica que estás usando tu correo institucional.']);
            exit;
        }

        // 2. Check if the user already registered
        $stmtUsuario = $pdo->prepare("SELECT id FROM usuarios WHERE correo_institucional = ?");
        $stmtUsuario->execute([$email]);
        $usuarioExiste = $stmtUsuario->fetch();

        if ($usuarioExiste) {
            echo json_encode(['success' => false, 'message' => 'Ya existe una cuenta vinculada a este correo.']);
            exit;
        }

        // 3. Hash password and insert
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        $stmtInsert = $pdo->prepare("INSERT INTO usuarios (nombres, apellidos, correo_institucional, password) VALUES (?, ?, ?, ?)");
        $result = $stmtInsert->execute([$nombres, $apellidos, $email, $hashedPassword]);

        if($result) {
            echo json_encode(['success' => true, 'message' => 'Usuario registrado exitosamente.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al registrar en la base de datos.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
