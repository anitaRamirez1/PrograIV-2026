<?php
$url = 'http://localhost/Progra-IV-semi-2026/private/modulos/docentes/docentes.php?accion=consultar';
$response = file_get_contents($url);
$data = json_decode($response, true);
echo "Total records: " . count($data) . "\n";
foreach($data as $d) {
    if($d['idDocente'] === 'test1') {
        echo "FOUND TEST RECORD in MySQL!";
        return;
    }
}
echo "Did not find test record.";
?>
