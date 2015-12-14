function distance(x,y){
    var dx= x[0]-y[0];
    var dy= x[1]-y[1];
    return Math.sqrt(dx*dx-dy*dy).toFixed(2);
}

//float scaleRatio;// 缩放系数，0无缩放，大于0则放大
// float radius;// 缩放算法的作用域半径
// vec2 leftEyeCenterPosition; // 左眼控制点，越远变形越小
// vec2 rightEyeCenterPosition; // 右眼控制点
// aspectRatio; // 所处理图像的宽高比
function eyebigger (centerPostion,currentPosition, radius, scaleRatio, aspectRatio) {
    var positionToUse = currentPosition;
    var currentPositionToUse = [currentPosition[0], currentPosition[1]*aspectRatio+0.5*(1-aspectRatio)];
    var centerPostionToUse = [centerPostion[0], centerPostion[1]*aspectRatio+0.5 *(1-aspectRatio)];
    var r = distance(currentPositionToUse, centerPostionToUse);

    if(r<radius){
         var alpha = 1.0 - scaleRatio * Math.pow(r / radius - 1.0, 2.0);
         positionToUse[0] = Math.round((centerPostion[0] + alpha*(currentPosition - centerPostion)));
         positionToUse[1] = Math.round((centerPostion[1] + alpha*(currentPosition - centerPostion)));
    }
      
    return positionToUse; 
}


