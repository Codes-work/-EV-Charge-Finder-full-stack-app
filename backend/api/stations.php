<?php
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    header("Content-type: application/json");
    header("Access-Control-Allow-Headers: Content-Type");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
    require_once __DIR__ . "/config/database.php";
    if($pdo){
        if(isset($_GET['user_lat']) && isset($_GET['user_lng'])){
            $user_lat = $_GET['user_lat'];
            $user_lng = $_GET['user_lng'];
            $stmt = $pdo->prepare("SELECT *,6371 * ACOS(
            COS(RADIANS(:user_lat)) * COS(RADIANS(latitude)) *
            COS(RADIANS(longitude) - RADIANS(:user_lng)) +
            SIN(RADIANS(:user_lat)) * SIN(RADIANS(latitude))) AS distance FROM 
            stations HAVING distance <= :radius ORDER BY distance ASC");
            $radius = $_GET['radius'] ?? 10;
            $stmt->execute(['user_lat'=> $user_lat,'user_lng'=> $user_lng,'radius'=>$radius]);
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                http_response_code(200);
                echo json_encode($result);
        }
        else{
            http_response_code(400);
            echo json_encode(['error'=> 'Required location']);
        }
        
    }  
?>    