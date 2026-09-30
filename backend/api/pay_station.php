<?php
    session_start();
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Credentials: true");

    if($_SERVER["REQUEST_METHOD"]==="OPTIONS"){
        http_response_code(204);
        exit;
    }
    require_once __DIR__ . "/config/database.php";

    if($pdo){

        if(!isset($_SESSION['user_id'])){
        http_response_code(400);
        echo json_encode(["error"=>"Login Required"]);
        exit;
        }
        if($_SERVER["REQUEST_METHOD"] === "POST"){
            $input = file_get_contents("php://input");
            $data = json_decode($input,true);
            if(!isset($data['kwh_requested']) || !is_numeric($data['kwh_requested']) || $data['kwh_requested'] <= 0){
                http_response_code(400);
                echo json_encode(["error"=>"required kwh"]);
                exit;
            }
            if(!isset($data['id']) || !is_numeric($data['id'])){
                http_response_code(400);
                echo  json_encode(["error"=>"required station"]);
                exit;
            }
            try{
                $check = $pdo->prepare("SELECT name, price_per_kwh from stations WHERE id=:id and status='available' and type='ev_charging' ");
                $check->execute(['id'=>$data['id']]);
                $station = $check->fetch(PDO::FETCH_ASSOC);
            }
            catch(PDOException $e){
                http_response_code(400);
                echo  json_encode(["error"=>"failed to check station"]);
                exit;
            }
            if(!$station){
                    http_response_code(400);
                    echo  json_encode(["error"=>"station unavailable"]);
                    exit;
                }
            $amount = $data['kwh_requested'] * $station['price_per_kwh'];    
            $transactionId = null;   
            try{
                $pdo->beginTransaction();    
                $stmt = $pdo->prepare("
                INSERT INTO transactions
                    (user_id, station_id, amount, type, status)
                VALUES
                    (:user_id, :station_id, :amount, :type, 'pending')
                ");

                $stmt->execute([
                    'user_id'    => $_SESSION['user_id'],
                    'station_id' => $data['id'],
                    'amount'     => $amount,
                    'type'       => 'payment'
                ]);
                $transactionId = $pdo->lastInsertId();
                $pdo->commit();

                $pdo->beginTransaction();
                $stmt1 = $pdo->prepare("UPDATE users SET wallet_balance= wallet_balance -:amount WHERE user_id=:user_id AND wallet_balance >= :amount");
                $stmt1->execute(['amount'=>$amount, 'user_id'=>$_SESSION['user_id']]);
                if($stmt1->rowCount() !== 1){
                    $pdo->rollBack();
                    $stmt2 = $pdo->prepare("UPDATE transactions SET status= :status WHERE transaction_id=:transaction_id");
                    $stmt2->execute(['status'=>'failed','transaction_id'=>$transactionId]);
                    http_response_code(400);
                    echo json_encode([
                        'error' => 'Insufficient balance',
                        'transaction_id' => $transactionId
                    ]);
                    exit;
                }
                $stmt3 = $pdo->prepare("UPDATE transactions SET status='success' WHERE transaction_id=:transaction_id");
                $stmt3->execute(['transaction_id'=>$transactionId]);
                $pdo->commit();
                http_response_code(200);
                echo json_encode(['message'=>'payment success',
                                'transaction_id'=>$transactionId,
                                'amount'=>$amount]);
                exit;   
            }
            catch(PDOException $e){
                if($pdo->inTransaction()){
                    $pdo->rollBack();
                }
                if ($transactionId !== null) {
                    try {
                        $update = $pdo->prepare("
                            UPDATE transactions
                            SET status = 'failed'
                            WHERE transaction_id = :transaction_id
                        ");
                        $update->execute([
                            'transaction_id' => $transactionId
                        ]);
                    }catch(PDOException $historyException) {
                        error_log(
                            'Failed to update transaction history: ' .
                            $historyException->getMessage()
                        );
                    }
                }
                http_response_code(500);
                error_log($e->getMessage());
                echo json_encode(['error'=>'failed']);
                exit;
            }
        }
    }
?>