<?php

require  "khatm.php";
$khatm = new Khatm;
header("Content-Type: application/json");

echo json_encode($khatm->count());
