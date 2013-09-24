
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
            piecePath: path,
            slotPaths: []
    }
    
    appendPathPointRects(obj.piecePath, 'piecePoint', 'piecePoint');
   
    // Iterate parent's child elements:
    // those with only two points are slots
    var childNodes = obj.piecePath.parentNode.childNodes;
    for (var i=0; i < childNodes.length; i++) {
        if (childNodes[i].nodeName.toLowerCase() == 'path') {
            path = childNodes[i];
            // is it a slot ?
            if (path.pathSegList.numberOfItems == 2) {
                obj.slotPaths.push(path);
                appendPathPointRects(path, 'slotPoint'+i+'_', 'slotPoint');
            }
        }
    }
    if (obj.slotPaths.length > 0)
        obj.piecePath.style['fill']='cyan';
    
    // debug:
    console.log('Piece "'+obj.piecePath.id+'" has '+obj.slotPaths.length+' slots.');
    //console.log(obj.slotPaths);
    
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

