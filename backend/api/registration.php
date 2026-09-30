<?php
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
    }
    require_once __DIR__ . "/config/database.php";

    if($pdo){
        $input = file_get_contents("php://input");
        $data = json_decode($input,true);
        if(isset($data['email']) && isset($data['password']) && isset($data['name'])){
            $name= trim($data['name']);
            $email = $data['email'];
            if($name === ''){
                http_response_code(400);
                echo json_encode(['error'=>"Invalid name"]);
                exit;
            }
            if(filter_var($email, FILTER_VALIDATE_EMAIL) === false){
                http_response_code(400);
                echo json_encode(['error'=>"Invalid email address"]);
                exit;
            }
            if (strlen($data['password']) < 8) {
                http_response_code(400);
                echo json_encode(['error'=>"Password must be at least 8 characters."]);
                exit;
            }
            if (!preg_match('/[A-Z]/', $data['password'])) {
                http_response_code(400);
                echo json_encode(['error'=> "Password must contain at least one uppercase letter."]);
                exit;
            }
            if (!preg_match('/[a-z]/', $data['password'])) {
                http_response_code(400);
                echo json_encode(['error'=> "Password must contain at least one lowercase letter."]);
                exit;
            }
            if (!preg_match('/[0-9]/', $data['password'])) {
                http_response_code(400);
                echo json_encode(['error'=>"Password must contain at least one number."]);
                exit;
            }
            $pass = password_hash($data['password'], PASSWORD_DEFAULT);
            try{
                $stmt = $pdo->prepare("INSERT INTO users (email, password, name)
                    values(:email,:password,:name)");
                $stmt->execute(['email'=>$email,'password'=>$pass,'name'=>$name]);
                if($stmt->rowCount()>0){
                    http_response_code(200);
                    echo json_encode(['success'=>true, 'message'=>'inserted', 'name'=>$name]);
                }
            }
            catch(PDOException $e){
                http_response_code(400);
                echo json_encode(['error'=>"failed to register user"]);
            }           
        }
        else{
            http_response_code(400);
            echo json_encode(['error'=>"please enter email and password"]);
        }
    }
?>