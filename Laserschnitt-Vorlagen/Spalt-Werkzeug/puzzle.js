
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
    for (var i=0; i<piece.pathSegList.numberOfItems; i++){
        var segment = piece.pathSegList.getItem(i);
        // no need to calc distances to moveto or closepath segments
        if (segment.pathSegTypeAsLetter.toUpperCase() != 'Z') {
            var distance = calcDistance(segment, slotFrom);
//            console.log(i+': '+distance);
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
    obj.cutSlots = function(debug) {
        var width=12;
        for (var i=0; i<this.slotPaths.length; i++) {
            var slot = this.slotPaths[i];
            if (debug)
                console.log('Piece path intersection of slot '+i+':');
            var a = findPieceSlotIntersection(this.piecePath, slot);
            if (a != null) {
                
                /*
                 * Zu Beginn gegeben sind zwei Punkte der Kurve: A und B,
                 * ausserdem die Schnittmarkierung mit den Punkten X und Y
                 *
                 *              Y
                 *              |
                 *              |
                 * A            X             B
                 * 
                 * Gesucht ist ein Vektor V der Länge w/2, rechtwinklig zur Schnittmarkierung.
                 * 
                 * Aus diesem ergeben sich die Punkte C, D, E und F,
                 * 
                 *          D---Y---E
                 *          |   |   |
                 *          |   |   |
                 * A--------C   X   F---------B
                 * 
                 * wobei aus der Distanz zu A und B geschlossen werden kann,
                 * auf welcher Seite der Schnittmarkierung sie sich befinden.
                 * 
                 * Der Algorithmus wird erweitert auf 6 Punkte, C bis H.
                 * 
                 *           E--Z--F
                 *          /   |   \
                 *          D   Y   G
                 *          |   |   |
                 * A--------C   X   H---------B
                 *               -->
                 *                n
                 */                
                
                var b = a+1;
                var A = this.piecePath.pathSegList.getItem(a);
                var B = this.piecePath.pathSegList.getItem(b);
                if (debug)
                    console.log(a+' - '+b);
                
                this.piecePath.pathSegList.removeItem(b);
                
                var X = slot.pathSegList.getItem(0);
                var Z = slot.pathSegList.getItem(1);
                var Y = Vector(X.x+((Z.x-X.x)/2), X.y+((Z.y-X.y)/2));
                
                var n = Vector(Y.x-X.x, Y.y-X.y).getOrthogonalVector().normalized().multiply(4);
                var m = n.multiply(0.85);
                
                var C = Vector(X.x-n.x, X.y-n.y);
                var D = Vector(Y.x-n.x, Y.y-n.y);
                var E = Vector(Z.x-m.x, Z.y-m.y);
                var F = Vector(Z.x+m.x, Z.y+m.y);
                var G = Vector(Y.x+n.x, Y.y+n.y);
                var H = Vector(X.x+n.x, X.y+n.y);
                
                // confused the sides ?
                if (calcDistance(A,C) > calcDistance(C,B) || calcDistance(A,H) < calcDistance(H,B)) {
                    H = [C, C = H][0];
                    G = [D, D = G][0];
                    F = [E, E = F][0];
                }
                
                this.piecePath.pathSegList.insertItemBefore(this.piecePath.createSVGPathSegLinetoAbs( C.x, C.y ), b++);
                this.piecePath.pathSegList.insertItemBefore(this.piecePath.createSVGPathSegLinetoAbs( D.x, D.y ), b++);
                this.piecePath.pathSegList.insertItemBefore(this.piecePath.createSVGPathSegLinetoAbs( E.x, E.y ), b++);
                this.piecePath.pathSegList.insertItemBefore(this.piecePath.createSVGPathSegLinetoAbs( F.x, F.y ), b++);
                this.piecePath.pathSegList.insertItemBefore(this.piecePath.createSVGPathSegLinetoAbs( G.x, G.y ), b++);
                this.piecePath.pathSegList.insertItemBefore(this.piecePath.createSVGPathSegLinetoAbs( H.x, H.y ), b++);
                
                // remove slot path
                this.slotPaths[i].parentNode.removeChild(this.slotPaths[i]);
                $('.slotPoint').remove();
            }
        }
    }
    
    return obj;
}

