function distance(p1,p2){
    var dx= p1[0]-p2[0];
    var dy= p1[1]-p2[1];
    return Math.sqrt(dx*dx + dy*dy).toFixed(2);
}

function eyebigger (centerPostion, currentPosition, radius, scaleRatio) {
    var offsetradius = distance(centerPostion, currentPosition);
    var positionToUse= currentPosition;
    var offsetx, offsety;

    if(offsetradius<radius){   // if in the circle
         var alpha = 1 - Math.pow(offsetradius/radius, 2.0);
         alpha = 1+scaleRatio/100/alpha;
         offsetx = alpha*(currentPosition[0] - centerPostion[0]);
         offsety = alpha*(currentPosition[1] - centerPostion[1]);

         offsetx = ( Math.abs(offsetx)>radius ) ? offsetx/Math.abs(offsetx) * radius : offsetx;
         offsety = ( Math.abs(offsetx)>radius ) ? offsety/Math.abs(offsety) * radius : offsety;

         positionToUse[0] = centerPostion[0] + offsetx;
         positionToUse[1] = centerPostion[1] + offsety;
    }
    return positionToUse; 
}