<?php
    session_start();
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Credentials: true");

    if($_SERVER['REQUEST_METHOD'] === "OPTIONS"){
        http_response_code(204);
        exit;
    }
    require_once __DIR__ . "/config/database.php";

    if($pdo){
        $input = file_get_contents("php://input");
        $data = json_decode($input, true);
        if(isset($data['email']) && isset($data['password'])){
            if(filter_var($data['email'], FILTER_VALIDATE_EMAIL) === FALSE){
                http_response_code(400);
                echo json_encode(['error'=>'Invalid email address']);
                exit;
            }
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email=:email");
            $stmt->execute(["email"=>$data['email']]);
            $user= $stmt->fetch();
            if(!$user || !password_verify($data['password'],$user['password']) ){
                http_response_code(401);
                echo json_encode(['error'=>'Invalid email or password']);
                exit;
            }
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['user_id'];
            http_response_code(200);
            echo json_encode(['success'=>true,
                            'message'=>'login successful',
                            'name'=>$user['name'],
                            'email'=>$user['email'],
                            'wallet_balance'=>$user['wallet_balance']]);
        }
        else{
            http_response_code(400);
            echo json_encode(["error"=>"email and password are required"]);
        }
    }
?>