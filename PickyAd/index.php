<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PickyAd--STREAM GAO</title>
    <link rel="stylesheet" href="css/style.css" type="text/css">
    <link rel="stylesheet" href="css/Dialog.css" />
    <link rel="stylesheet" href="css/reset.css" />
</head>

<body>
<div id="container">
    <div id="title" class="title" >Unknown Name
    </div>
        <div id="gold"></div>
        <div id="goldNum">0</div>
    <div id="subcontainer">
        <div id="questions">

            <video id="video" controls>
                <source id="source" src="https://s3-us-west-2.amazonaws.com/video-gao/video1.mp4" type="video/mp4">
                Congradulations!! Your browser does not support the video tag.
            </video>

            <div class="answerList">
                <div class="answer">
                    <div class="rightAnswer" id="right"></div>
                </div>
                <div class="line"> </div>
                <div id="list">
                    <div class="list" id="0"></div>
                    <div class="list" id="1"></div>
                    <div class="list" id="2"></div>
                    <div class="list" id="3"></div>
                    <div class="list" id="4"></div>
                    <div class="list" id="5"></div>
                    <div class="list" id="6"></div>
                    <div class="list" id="7"></div>
                    <div class="list" id="8"></div>
                </div>
            </div>
        </div>   <!--question-->

    </div>
    <footer class="footer"> @2014 by Stream Gao. ITP</footer>
</body>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="js/jquery.easing.1.3.js"></script>
<script src="js/Dialog.js"></script>
<script type="text/javascript" src="js/control.js"> </script>
</html>