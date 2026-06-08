<?php
session_start();
header('Content-Type: application/json');
require_once '../conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if(empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Faltan credenciales.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, nombres, apellidos, password, estado FROM usuarios WHERE correo_institucional = ?");
        $stmt->execute([$email]);
        $usuario = $stmt->fetch();

        if ($usuario) {
            if ($usuario['estado'] == 0) {
                echo json_encode(['success' => false, 'message' => 'Cuenta suspendida. Contacte al administrador.']);
                exit;
            }

            if (password_verify($password, $usuario['password'])) {
                // Correct password
                $_SESSION['user_id'] = $usuario['id'];
                $_SESSION['nombres'] = $usuario['nombres'];
                $_SESSION['apellidos'] = $usuario['apellidos'];

                echo json_encode(['success' => true, 'message' => 'Login exitoso.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'El correo institucional no está registrado.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>
