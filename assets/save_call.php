<?php
include('conexion.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $numero = $_POST['numero'];
    $interlocutor1 = $_POST['interlocutor1'];
    $interlocutor2 = $_POST['interlocutor2'];
    $hora = $_POST['hora'];
    $fecha = $_POST['fecha'];

    if (guardarLlamada($numero, $interlocutor1, $interlocutor2, $hora, $fecha)) {
        echo "Llamada guardada correctamente";
    } else {
        echo "Error al guardar la llamada";
    }
}
?>
