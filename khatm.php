<?php

class DB {
    private $db;
    public function __construct()
    {   
        $this->db = new PDO("mysql:host=localhost;dbname=khatm", "root");
    }
    public function getDB(){
        return $this->db;
    }
}

class Khatm{
    private $sql;
    public function __construct()
    {
        $db = new DB;
        $this->sql = $db->getDB();
    }
    public function create($first_ayeh){
        $ayehs = serialize([$first_ayeh]);
        $query = "INSERT into khatm (ayehs) VALUES (:a)";
        $query = $this->sql->prepare($query);
        $query->bindValue(":a", $ayehs);
        $query->execute();
    }
    public function get_ayehs($id){
        $query = "select * from khatm where id = :id";
        $query = $this->sql->prepare($query);
        $query->bindValue(":id", $id);
        $query->execute();
        $ayehs = $query->fetch()["ayehs"];
        return unserialize($ayehs);
    }
    public function update_ayehs($ayeh){
        $last = $this->get_last();
        if($last){
            $id = $last["id"];
            $ayehs = $this->get_ayehs($id);
            if(count($ayehs)+1 > 6236){
                $this->create($ayeh);
            }else{
                $ayehs[] = $ayeh;
                $query = "update khatm set ayehs=:ayehs where id = :id";
                $query = $this->sql->prepare($query);
                $query->bindValue(":ayehs", serialize($ayehs));
                $query->bindValue(":id", $id);
                $query->execute();
            }
        }else{
            $this->create($ayeh);
        }
        return json_encode(["success"=>true, "message"=>"یک آیه با موفقیت به این ختم اضافه شد."]);
    }
    public function get_last(){
        $query = "select * from khatm ORDER BY id DESC LIMIT 1;";
        $query = $this->sql->query($query);
        $query->execute();
        return $query->fetch();
    }
    public function count(){
        $query = "select * from khatm";
        $query = $this->sql->query($query);
        $query->execute();
        return $query->rowCount();
    }
}