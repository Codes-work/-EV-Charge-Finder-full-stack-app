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
            http_response_code(401);
            echo json_encode(['error'=>'Not logged in']);
            exit;
        }
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $user_id = $_SESSION['user_id'];
            $input = file_get_contents("php://input");
            $data = json_decode($input,true);
            if(!isset($data['amount']) || !is_numeric($data['amount']) || $data['amount'] <= 0){
                http_response_code(400);
                echo json_encode(['error'=>'amount is required']);
                exit;
            }
            $amount = (int) round($data['amount'] * 100);
            $ch = curl_init("https://api.razorpay.com/v1/orders");
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'amount'=>$amount,
                'currency'=>'INR',
                'receipt'=>'order_rcpt_'.time(),
            ]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_USERPWD, RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET);
            $response = curl_exec($ch);
            curl_close($ch);
            if(!$response){
                http_response_code(400);
                echo json_encode("failed to fetch");
                exit;
            }
            $order_data = json_decode($response,true);
            if(!isset($order_data['id'])){
                http_response_code(400);
                echo json_encode(['error'=>'error in creating order id']);
                exit;
            }
            try{
                $stmt = $pdo->prepare("
                    INSERT INTO transactions
                        (user_id, type, razorpay_order_id, amount)
                    VALUES
                        (:user_id, :type, :razorpay_order_id, :amount)
                ");
                $stmt->execute(['user_id'=>$user_id,'type'=>'topup','razorpay_order_id'=>$order_data['id'],'amount'=>$data['amount']]);
            }
            catch(PDOException $e){
                http_response_code(400);
                echo json_encode(['error'=>'failed to insert data']);
                exit;
            }
            http_response_code(200);
            echo json_encode(['razorpay_order_id'=>$order_data['id'],
                'RAZORPAY_KEY'=>RAZORPAY_KEY_ID,
                'message'=>'inserted order id',
                'amount'=>$amount]);
        }
    }
?>