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
            echo json_encode(['error'=>'Not logged in']);
            exit;
        }
        if($_SERVER['REQUEST_METHOD'] === "POST"){
            $input = file_get_contents("php://input");
            $data = json_decode($input,true);
            if( !isset($data['razorpay_signature']) ||
                !isset($data['razorpay_order_id']) || 
                !isset($data['razorpay_payment_id'])){

                http_response_code(400);
                echo json_encode(['error'=>'missing required fields']);
                exit;
            }
            $order_id = $data['razorpay_order_id'];
            $payment_id = $data['razorpay_payment_id'];
            $signature = $data['razorpay_signature'];

            $generated_signature = hash_hmac('sha256', $order_id . '|' . $payment_id, RAZORPAY_KEY_SECRET );

            if(!hash_equals($generated_signature,$signature)){
                try{
                    $stmt = $pdo->prepare("
                    UPDATE transactions
                    SET status = :status
                    WHERE razorpay_order_id = :razorpay_order_id
                    AND user_id = :user_id"
                    );
                    $stmt->execute([
                        'status' => 'failed',
                        'razorpay_order_id' => $order_id,
                        'user_id'=>$_SESSION['user_id']
                    ]);
                }
                catch(PDOException $e){
                    http_response_code(400);
                    echo json_encode(['error'=>'Unable to process payment']);
                    exit;
                }
                http_response_code(400);
                echo json_encode(['error'=>'failed to verify payment']);
                exit;
            }
            $pdo->beginTransaction();
            try{
                $stmt1= $pdo->prepare("SELECT amount,status FROM transactions 
                                WHERE razorpay_order_id = :razorpay_order_id 
                                AND user_id =:user_id
                                FOR UPDATE");
                $stmt1->execute(['razorpay_order_id'=>$order_id,'user_id'=>$_SESSION['user_id']]);
                $result = $stmt1->fetch();
                if (!$result) {
                    throw new PDOException('Transaction not found');
                }
                if ($result['status'] === 'success') {
                    $pdo->commit();

                    http_response_code(200);
                    echo json_encode([
                        'message' => 'Payment already processed'
                    ]);
                    exit;
                }
                $stmt2=$pdo->prepare("UPDATE transactions
                                SET status=:status,
                                razorpay_payment_id=:razorpay_payment_id
                                WHERE razorpay_order_id=:razorpay_order_id AND user_id=:user_id");
                $stmt2->execute([
                'status' => 'success',
                'razorpay_payment_id' => $payment_id,
                'razorpay_order_id' => $order_id,
                'user_id'=>$_SESSION['user_id']
                ]);
                if ($stmt2->rowCount() !== 1) {
                    throw new PDOException('Failed to update transaction');
                }
                $stmt3=$pdo->prepare("UPDATE users
                                SET wallet_balance= wallet_balance + :wallet_balance
                                WHERE user_id=:user_id");
                $stmt3->execute(['wallet_balance'=>$result['amount'],'user_id'=>$_SESSION['user_id']]);
                if ($stmt3->rowCount() !== 1) {
                    throw new PDOException('Failed to update wallet balance');
                }                                
                $pdo->commit();
                http_response_code(200);
                echo json_encode(['message'=>'payment success',
                                'amount'=>$result['amount']]);
                exit;
            }
            catch(PDOException $e){
                $pdo->rollback();
                http_response_code(400);
                error_log($e->getMessage());
                echo json_encode(['error'=>'failed']);
                exit;
            }
            
        }
    }
?>