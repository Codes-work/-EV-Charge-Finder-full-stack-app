<?php
    session_start();
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
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

        if($_SERVER["REQUEST_METHOD"] === "GET"){

            $page  = isset($_GET['page'])  && is_numeric($_GET['page'])  ? (int)$_GET['page']  : 1;
            $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 20;

            if($page < 1)  $page = 1;
            if($limit < 1) $limit = 20;
            if($limit > 100) $limit = 100; 
            $offset = ($page - 1) * $limit;
            $allowedTypes   = ['topup', 'payment'];
            $allowedStatus  = ['pending', 'success', 'failed'];

            $type   = isset($_GET['type'])   && in_array($_GET['type'], $allowedTypes, true)   ? $_GET['type']   : null;
            $status = isset($_GET['status']) && in_array($_GET['status'], $allowedStatus, true) ? $_GET['status'] : null;

            $where  = "WHERE t.user_id = :user_id";
            $params = ['user_id' => $_SESSION['user_id']];

            if($type !== null){
                $where .= " AND t.type = :type";
                $params['type'] = $type;
            }
            if($status !== null){
                $where .= " AND t.status = :status";
                $params['status'] = $status;
            }

            try{
                $countStmt = $pdo->prepare("SELECT COUNT(*) FROM transactions t $where");
                $countStmt->execute($params);
                $total = (int) $countStmt->fetchColumn();

                $stmt = $pdo->prepare("
                    SELECT
                        t.transaction_id,
                        t.station_id,
                        s.name AS station_name,
                        t.amount,
                        t.type,
                        t.status,
                        t.razorpay_payment_id,
                        t.razorpay_order_id,
                        t.created_at
                    FROM transactions t
                    LEFT JOIN stations s ON s.id = t.station_id
                    $where
                    ORDER BY t.created_at DESC
                    LIMIT :limit OFFSET :offset
                ");

                foreach($params as $key => $value){
                    $stmt->bindValue(':' . $key, $value);
                }
                $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
                $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
                $stmt->execute();

                $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

                http_response_code(200);
                echo json_encode([
                    'transactions' => $transactions,
                    'pagination' => [
                        'page'  => $page,
                        'limit' => $limit,
                        'total' => $total,
                        'total_pages' => (int) ceil($total / $limit)
                    ]
                ]);
                exit;

            } catch(PDOException $e){
                http_response_code(500);
                error_log($e->getMessage());
                echo json_encode(['error' => 'failed to fetch transactions']);
                exit;
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'method not allowed']);
            exit;
        }
    }
?>