
/*
 * convert all segments of a path from relative coordinates to absolute
 * http://stackoverflow.com/questions/9677885/convert-svg-path-to-absolute-commands
 */
convertPathToAbsolute = function(path){
    var x0,y0,x1,y1,x2,y2,segs = path.pathSegList;
    for (var x=0,y=0,i=0,len=segs.numberOfItems;i<len;++i){
      var seg = segs.getItem(i);
      var c = seg.pathSegTypeAsLetter;
      if (/[MLHVCSQTA]/.test(c)){
        if ('x' in seg) x=seg.x;
        if ('y' in seg) y=seg.y;
      }else{
        if ('x1' in seg) x1=x+seg.x1;
        if ('x2' in seg) x2=x+seg.x2;
        if ('y1' in seg) y1=y+seg.y1;
        if ('y2' in seg) y2=y+seg.y2;
        if ('x'  in seg) x+=seg.x;
        if ('y'  in seg) y+=seg.y;
        switch(c){
          case 'm': segs.replaceItem(path.createSVGPathSegMovetoAbs(x,y),i);                   break;
          case 'l': segs.replaceItem(path.createSVGPathSegLinetoAbs(x,y),i);                   break;
          case 'h': segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x),i);           break;
          case 'v': segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y),i);             break;
          case 'c': segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x,y,x1,y1,x2,y2),i); break;
          case 's': segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x,y,x2,y2),i); break;
          case 'q': segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x,y,x1,y1),i);   break;
          case 't': segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x,y),i);   break;
          case 'a': segs.replaceItem(path.createSVGPathSegArcAbs(x,y,seg.r1,seg.r2,seg.angle,seg.largeArcFlag,seg.sweepFlag),i);   break;
          case 'z': case 'Z': x=x0; y=y0; break;
        }
      }
      // Record the start of a subpath
      if (c=='M' || c=='m') x0=x, y0=y;
    }
  }

applyMatrixToPoint = function(matrix, x, y) {
    var p = svg.createSVGPoint();
    p.x = x;
    p.y = y;
    return p.matrixTransform(matrix);
}

applyMatrixToPath = function(matrix, path) {
    var segs = path.pathSegList;
    console.log('Before transformation:');
    console.log(path);
    console.log('Transformation matrix:');
    console.log(matrix);
    for (var i=0; i < segs.numberOfItems; i++) {
        var seg = path.pathSegList.getItem(i);
        var c = seg.pathSegTypeAsLetter;
        switch(c) {
            case 'M','L':
                var coord = applyMatrixToPoint(matrix, seg.x, seg.y);
                segs.replaceItem(path.createSVGPathSegMovetoAbs(coord.x, coord.y), i);
                console.log(coord);
                break;
            case 'C':
                var coord = applyMatrixToPoint(matrix, seg.x, seg.y);
                var handle1 = applyMatrixToPoint(matrix, seg.x1, seg.y1);
                var handle2 = applyMatrixToPoint(matrix, seg.x2, seg.y2);
                segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(coord.x, coord.y, handle1.x, handle1.y, handle2.x, handle2.y), i);
                break;
        }
    }
    console.log('After transformation:');
    console.log(path);
}

applyMatrixToGroup = function(matrix, group) {
    for (var i=0; i < group.childNodes.length; i++) {
        if (group.childNodes[i].nodeName.toLowerCase() == 'path')
            applyMatrixToPath(matrix, group.childNodes[i]);
    }
}

applyGroupTransform = function(group) {
    //var transform = group.getAttribute('transform');
    var transform = group.getCTM();
    console.log('Applying group CTM:');
    console.log(transform);
    
    applyMatrixToGroup(transform, group);
    
    group.setAttribute('transform', '');
}

/*
 * draw some Inkscape-like rectangles to show where the path points are
 */
addPathPointRects = function(path, prefixId, addClass) {
    for (var i=0; i<path.pathSegList.numberOfItems; ++i){
        var segment = path.pathSegList.getItem(i);
//        console.log(i+': ');
//        console.log(segment);
        if (segment.pathSegType != SVGPathSeg.PATHSEG_CLOSEPATH)
            d3.select('#layer1')
                .append('rect')
                    .attr("id", prefixId+i)
                    .attr("class", "pathPoint "+addClass)
                    .attr("x", parseFloat(segment.x)-4)
                    .attr("y", parseFloat(segment.y)-4)
                    .attr("width", 8)
                    .attr("height", 8)
                    .attr("tooltip", i);
    }
}

/*
 * calculate the distance in pixels between two points A and B
 */
calcDistance = function(A, B) {
    return Math.sqrt( Math.pow(B.x-A.x,2) + Math.pow(B.y-A.y,2) );
}
