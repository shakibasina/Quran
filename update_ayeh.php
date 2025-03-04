<?php

require  "khatm.php";
$khatm = new Khatm;

$ayeh = $_POST["ayeh"];
return json_encode($khatm->update_ayehs($ayeh));