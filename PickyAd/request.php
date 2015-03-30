<?php

$user_name="stream";
$password="gaoxi123";
$database="pickyad";
$hostname="aaglnrhc6ky1th.ch5sjbwjm96s.us-west-2.rds.amazonaws.com";

$connect_db = mysql_connect($hostname, $user_name , $password);
$find_db = mysql_select_db($database);

//get differernt methods
if($_SERVER['REQUEST_METHOD'] === "POST" ){
    $method = $_POST['method'];
}else{
    $method = $_GET['method'];
}

//define different routes
$question = new QuestionAction();
$methods = get_class_methods($question);

if(empty($_GET['op'])|| $_GET['op']=='') {
    $question->fallback();
    die;
}

$op = $_GET['op'];
if(in_array($op, $methods)) {
    $question->$op();
}
else {
    $question->fallback();
}




class QuestionAction
{

    function __construct()
    {
        global $connect_db;
        global $find_db;
    }

    public function fallback()
    {
        //if there is no function to recall
        echo "Use Action Fallback.\n";
    }

    public function returnVideo( ){
        $question_id = $_GET['question_id'];
        global $connect_db;
        global $find_db;

        if($find_db) {
            $query = "SELECT video.* FROM video WHERE video_id='$question_id' ";
            $result = mysql_query($query);

            while ($field = mysql_fetch_row($result)) {

                $video_id = $field[0];
                $video_add = $field[1];
                $video_title = $field[2];
            }
            $response = array("video_id" => $video_id,
                "video_add" => $video_add,
                "video_title" => $video_title,
            );

            echo json_encode($response);
        }
    }//videoId


    public function returnAnswerList(){
        $question_id = $_GET['question_id'];
        global $connect_db;
        global $find_db;
        $res_count=0;

        if($find_db) {
            $query = "SELECT answer.* FROM answer WHERE video_id='$question_id'";
            $result = mysql_query($query);

            while ($field = mysql_fetch_row($result)) {

                $answer_id = $field[0];
                $answer_title = $field[2];
                $answer_right = $field[3];
                $answer_logo = $field[4];

                $response[$res_count] = array(
                    "answer_id" => $answer_id,
                    "answer_title" => $answer_title,
                    "answer_right" => $answer_right,
                    "answer_logo" => $answer_logo
                );
                $res_count++;
            }
            echo json_encode($response);
        }
    }


    public function addComments(){

        $name = $_GET['name'];
        $comment = $_GET['comment'];

        if($find_db) {
            $query = "INSERT INTO suggestion (author, comments)
                            VALUES ('$name','$comment') ";

            if($res = @mysql_query($query) ){
                echo"Thanks for your comments!";
                echo ' $name' + $name;
                echo $query;

            }else{
                echo"Sorry there is something wrong......";
            }
        }
    }
}

?>