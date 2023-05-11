<?php

include('./conn.php');



if(isset($_GET['totalTime'])) {

    date_default_timezone_set("Asia/Calcutta");
    $d_t = date("Y-m-d H:i:s");

    foreach ($_GET as $key => $value) {
        $$key = $value;

    }

   
    $sql_page = "INSERT INTO 
                `page_visit_details`(
                    `page_url`, 
                    `page_name`, 
                    `total_time_stayed`, 
                    `location`, 
                    `time_bounce`, 
                    `timezone`, 
                    `uid`, 
                    `lat`, 
                    `longi`, 
                    `device_type`
                    ) VALUES (
                        '$page_url',
                        '$pathname',
                        '$totalTime',
                        '$location',
                        '$d_t',
                        '$timezone',
                        '$uuid',
                        '$lat',
                        '$longi',
                        '$device_type'
                        )";
    $conn->query($sql_page);


}
if(isset($_GET['button_clicked'])){

    date_default_timezone_set("Asia/Calcutta");
    $d_t = date("Y-m-d H:i:s");
  
    foreach ($_GET as $key => $value) {
        $$key = $value;
    }

    $sql_btnClk = "INSERT INTO `button_clicked_info`( 
                        `page_url`, 
                        `page_name`, 
                        `button_name`, 
                        `button_clicked_time`, 
                        `uuid`, 
                        `location`, 
                        `timezone`, 
                        `lat`, 
                        `longi`, 
                        `device_type`) 
                        VALUES (
                            '$page_url', 
                            '$page_name', 
                            '$button_name',
                            '$d_t','$uuid',
                            '$location',
                            '$timezone',
                            '$lat',
                            '$longi',
                            '$device_type')";
    $conn->query($sql_btnClk);
    // $uuid = $_GET['uuid'];
    // $data = "\n*******************\nAdd to cart is clicked at $d_t user_id $uuid  \n***************\n";
    // file_put_contents("test.txt", $data, FILE_APPEND);
}
if(isset($_GET['phone'])){
    $phone = $_GET['phone'];
    $uuid = $_GET['uuid'];
    $date_time = $_GET['dateTime'];
    $sql_select = $conn->query("SELECT * FROM `user_info` WHERE uuid='$uuid' AND phone='$phone'");
    
    if($sql_select->num_rows <= 0 ){
        $sql_insert = "INSERT INTO `user_info`( `uuid`, `phone`, `time_created`) VALUES ('$uuid', '$phone', '$date_time')";
        $conn->query($sql_insert);
    }
}


?>
