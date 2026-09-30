<?php
    session_start();
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Credentials: true");

    if($_SERVER['REQUEST_METHOD'] === "OPTIONS"){
        http_response_code(204);
        exit;
    }
    require_once __DIR__ . "/config/database.php";
    require_once __DIR__ . "/config/razorpay.php";

    if($pdo){
        if(!isset($_SESSION['user_id'])){
            http_response_code(400);
            echo json_encode(['error'=>'Not Logged in']);
            exit;
        }
        if($_SERVER['REQUEST_METHOD'] === "POST"){
            $input = file_get_contents("php://input");
            $data = json_decode($input,true);
            if(!isset($data['razorpay_order_id'])){
                http_response_code(400);
                echo json_encode(['error'=>'order id required']);
                exit;
            }
            try{
                $stmt = $pdo->prepare("UPDATE transactions SET status='failed' 
                                    WHERE razorpay_order_id = :razorpay_order_id AND user_id = :user_id
                                    AND status='pending' ");
                $stmt->execute(['razorpay_order_id'=>$data['razorpay_order_id'],'user_id'=>$_SESSION['user_id']]);
                echo json_encode([
                    'message' => 'Transaction marked as failed'
                ]);                    
            }catch(PDOException $e){
                http_response_code(400);
                echo json_encode(['error'=>'Unable to update transaction']);
            }
        }
    }
?>