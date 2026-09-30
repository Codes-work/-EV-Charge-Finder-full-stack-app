<?php
    $host = "localhost";
    $username = "root";
    $password = "your_db_password_here";
    $dbname = "ev_charge_finder";

    try{
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOException $e){
        echo $e->getMessage();
    }
?>