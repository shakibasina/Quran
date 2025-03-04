<?php

require  "khatm.php";
$khatm = new Khatm;
header("Content-Type: application/json");

$last = $khatm->get_last();
if($last){
    echo json_encode(unserialize($last["ayehs"]));
}else{
    echo json_encode([[false]]);
}