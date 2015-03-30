<?php

 //   session_start();
    //sentiment analysis
    require_once 'alchemyapi.php';
    $alchemyapi = new AlchemyAPI();

    $demo_text = $_GET['analyseText'];
    $response = $alchemyapi->sentiment('text', $demo_text, null);
    if ($response['status'] == 'OK') {

        if (array_key_exists('score', $response['docSentiment'])) {
            $respond = $response['docSentiment'];
        } else {
            $respond = array("type" => "neutral", "score" => "0.5");
        }
    } else {
        $respond = array("Error" => $response['statusInfo']);
    }

    echo json_encode($respond);


/*-------------database-------------*/
    $user_name = "stream";
    $password = "gaoxi123";
    $database = "mindfullamp";
    $hostname = "aaglnrhc6ky1th.ch5sjbwjm96s.us-west-2.rds.amazonaws.com";

    $connect_db = mysql_connect($hostname, $user_name, $password);
    $find_db = mysql_select_db($database);

    $type = $respond['type'];
    $score = $respond['score'];
    $mixed = $respond['mixed'];

    $id = 1;


if ( $type == "positive" ){
    $type = "1";
}else if( $type == "negative" ){
    $type = "2";
}else {  //netural
    $type = "0";
}

if( $mixed==null ){
    $mixed = "0";
}

    //update database
    if($find_db) {
        $query = "UPDATE emotion  SET type='$type',score='$score'  WHERE id='$id' ";
        $result = mysql_query($query);

//        if( !$result ) {
//            $info = array( "error" => "no result" );
//        }
    }else {
        $info = array("error" => "databse connection fail");
    }


?>