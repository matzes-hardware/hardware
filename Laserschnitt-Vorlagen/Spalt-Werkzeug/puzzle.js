
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

/*
 * Identify the smaller point index of the intersected piece segment
 */
findPieceSlotIntersection = function(piece, slot) {
    
    // get slot dimensions
    var slotFrom = slot.pathSegList.getItem(0);
    var slotTo = slot.pathSegList.getItem(1);
    var slotWidth = 20;
    
    var pointBeforeIndex = pointAfterIndex = null;
    var minDistance1 = minDistance2 = piece.getTotalLength(); // maximum possible distance
    var minDistancePointIndex1 = minDistancePointIndex2 = null;
    for (var i=0; i<piece.pathSegList.numberOfItems; ++i){
        var segment = piece.pathSegList.getItem(i);
        if (segment.pathSegType == SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS) {
            var distance = calcDistance(segment, slotFrom);
//            console.log(i+': '+distance)
            if (distance < minDistance1) {
                minDistance2 = minDistance1;
                minDistancePointIndex2 = minDistancePointIndex1;
                minDistance1 = distance;
                minDistancePointIndex1 = i;
            } else if (distance < minDistance2) {
                minDistance2 = distance;
                minDistancePointIndex2 = i;
            }
        }
    }
    if (minDistancePointIndex2 < minDistancePointIndex1) // then swap variables
        minDistancePointIndex2 = [minDistancePointIndex1, minDistancePointIndex1 = minDistancePointIndex2][0];
    
/*    // highlight intersection
    $('#piecePoint'+minDistancePointIndex1).css('fill', 'red');
    $('#piecePoint'+minDistancePointIndex2).css('fill', 'red'); */
    
    return minDistancePointIndex1;
}

Piece = function(path) {
    
    obj = {
            piece: path,
            slots: []
    }
    
    // debug:
    console.log('Piece: ');
    console.log(obj.piece);
    
    // draw some Inkscape-like rectangles to show where the path points are 
    addPathPointRects(obj.piece, 'piecePoint', 'piecePoint');
   
    // iterate parent's child elements
    // those with only two points are slots
    var childNodes = obj.piece.parentNode.childNodes;
    for (var i=0; i < childNodes.length; i++) {
        if (childNodes[i].nodeName.toLowerCase() == 'path') {
            path = childNodes[i];
            
            // convert coordinates to absolute
            convertPathToAbsolute(path);
            
            // is it a slot ?
            if (path.pathSegList.numberOfItems == 2) {
                applyMatrixToPath(path.getCTM(), path);
               // path.setAttribute('transform', '');
                obj.slots.push(path);
                addPathPointRects(path, 'slotPoint'+i+'_', 'slotPoint');
            }
        }
    }
    if (obj.slots.length > 0)
        obj.piece.style['fill']='cyan';
    
    // debug:
    console.log('Slots: '+obj.slots.length);
    console.log(obj.slots);
    
    // apply and remove <g transform="matrix(...);"> from parent
    //if (obj.piece.parentNode.nodeName.toLowerCase() == 'g')
      //  applyGroupTransform(obj.piece.parentNode);
    
    /*
     * for all slots:
     * remove intersected piece segment
     * insert four Lineto segments drawing a slot
     */
    obj.cutSlots = function() {
        var width=12;
        for (var i=0; i<this.slots.length; i++) {
            console.log('Piece path intersection of slot '+i+':');
            var a = findPieceSlotIntersection(this.piece, this.slots[i]);
            var b = a+1;
            console.log(a+' - '+b);
            
            var A = slots[i].pathSegList.getItem(0);
            var B = slots[i].pathSegList.getItem(1);
            var w = width/2;
            if (this.piece.pathSegList.getItem(a).x > this.piece.pathSegList.getItem(b).x)
                w = -w;
            this.piece.pathSegList.removeItem(b);
            this.piece.pathSegList.insertItemBefore(piece.createSVGPathSegLinetoAbs( A.x-w, A.y ), b++);
            this.piece.pathSegList.insertItemBefore(piece.createSVGPathSegLinetoAbs( B.x-w, B.y ), b++);
            this.piece.pathSegList.insertItemBefore(piece.createSVGPathSegLinetoAbs( B.x+w, B.y ), b++);
            this.piece.pathSegList.insertItemBefore(piece.createSVGPathSegLinetoAbs( A.x+w, A.y ), b++);
            
            // remove slot path
            this.slots[i].parentNode.removeChild(this.slots[i]);
            $('.slotPoint').remove();
        }
    }
    
    return obj;
}

/*
 * Main functions
 * 
 * Algorithm: 
 * for every slot:
 * identify the affected piece segment
 * create a slot segment from slot path
 * replace piece segment by slot segment
 * remove slot path
 * 
 */

load = function() {
    // discriminate between piece and slot paths
    var svg = document.getElementById('svg');
    var paths = svg.getElementsByTagName('path');
    
    allPieces = [];
    allSlots = [];
    for (var i=0; i<paths.length; i++) {
        if (paths[i].pathSegList.numberOfItems > 2)
            allPieces.push(Piece(paths[i]));
        else
            allSlots.push(paths[i]);
    }
    console.log(allPieces.length+' pieces identified');
    
    // now that we have identified all slots, we have to sort them to the corresponding pieces
    for (var i=0; i<paths.length; i++) {
        
        }
}

cut = function() {
    // for all pieces:
    //  cut slots
}
