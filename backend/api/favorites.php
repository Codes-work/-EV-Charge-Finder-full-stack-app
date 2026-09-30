<?php
    session_start();
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");

    if($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(204);
        exit;
    }
    require_once __DIR__ . "/config/database.php";

    if($pdo){
        if(!isset($_SESSION['user_id'])){
            http_response_code(401);
            echo json_encode(['error'=> 'Not logged in']);
            exit;
        }
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $input = file_get_contents('php://input');
            $data = json_decode($input,true);
            if(!isset($data['id']) || !is_numeric($data['id'])){
                http_response_code(400);
                echo json_encode(['error'=> 'station id is required']);
                exit;
            }
            $stationId =(int)$data['id'];
            $userId =(int)$_SESSION['user_id'];

            try{
            $check =$pdo->prepare('SELECT fav_id FROM favorites 
                        WHERE station_id=:station_id AND user_id=:user_id');
            $check->execute(['station_id'=>$stationId,'user_id'=>$userId]);
            if($check->fetch()){
                http_response_code(400);
                echo json_encode(['error'=> 'station already in favorite']);
                exit;
            }
            
                $stmt = $pdo->prepare('INSERT INTO favorites (station_id, user_id)
                        VALUES(:station_id,:user_id)');
                $stmt->execute(['station_id'=>$stationId,'user_id'=>$userId]);
                if($stmt->rowCount() > 0){
                    http_response_code(201);
                    echo json_encode(['success'=> true,'message'=>'station added to favorites']);
                    }
                }
                catch(PDOException $e) {
                    http_response_code(500);
                    echo json_encode(['error'=> 'failed to add station to favorite']);
                }
            exit;    
        }
        if($_SERVER['REQUEST_METHOD'] === 'DELETE'){
            if(!isset($_GET['id']) || !is_numeric($_GET['id'])){
                http_response_code(400);
                echo json_encode(['error'=> 'station id is required']);
                exit;
            }
            $stationId =(int)$_GET['id'];
            $userId =(int)$_SESSION['user_id'];
            try{
                $stmt = $pdo->prepare('DELETE FROM favorites
                     WHERE station_id=:station_id AND user_id=:user_id');
                $stmt->execute(['station_id'=>$stationId,'user_id'=>$userId]);
                if($stmt->rowCount() === 0){
                    http_response_code(404);
                    echo json_encode(['error'=>'station is not in favorites']);
                    exit;
                }
                http_response_code(200);
                echo json_encode(['success'=> true,'message'=> 'station removed from favorites']);
            }
            catch(PDOException $e) {
                http_response_code(500);
                echo json_encode(['error'=> 'failed to delete station from favorites']);
            }
            exit;
        }
        if($_SERVER['REQUEST_METHOD'] == 'GET'){
            $userId = $_SESSION['user_id'];
            try{
                $stmt= $pdo->prepare("SELECT s.id,
                            s.name,s.address,s.latitude,s.longitude,s.price_per_kwh,s.num_bays,s.charge_type,s.status,s.hours,s.type
                            from favorites f
                            INNER JOIN stations s on f.station_id = s.id
                            WHERE f.user_id=:user_id");
                $stmt->execute(['user_id'=>$userId]);
                $fav = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if(empty($fav)){
                    http_response_code(200);
                    echo json_encode(['success'=>true,
                    'message'=> 'No favorite station found',
                    'favorites'=>[]]);
                    exit;
                }
                http_response_code(200);
                echo json_encode(['success'=> true,
                'message'=> 'Retrieved favourite stations',
                'favorites'=>$fav]);
                }
                catch(PDOException $e) {
                    http_response_code(500);
                    echo json_encode(['error'=> 'cannot fetch favorite stations']);
                }
                exit;
        }
    }    
    

?>