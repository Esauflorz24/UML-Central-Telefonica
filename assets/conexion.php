<?php
$servername = "localhost"; // Cambia a tu servidor
$username = "root"; // Cambia a tu nombre de usuario
$password = ""; // Cambia a tu contraseña
$dbname = "simulacion_llamada"; // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Guardar llamada en la base de datos
function guardarLlamada($numero, $interlocutor1, $interlocutor2, $hora, $fecha) {
    global $conn;
    $sql = "INSERT INTO llamadas (numeroTelef_marcado, interlocutor1, interlocutor2, hora, fecha) VALUES ('$numero', '$interlocutor1', '$interlocutor2', '$hora', '$fecha')";
    if ($conn->query($sql) === TRUE) {
        return true;
    } else {
        return false;
    }
}
?>
