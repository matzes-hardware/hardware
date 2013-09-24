
/*
 * Calculate the distance in pixels between two points A and B
 */
calcDistance = function(A, B) {
    return Math.sqrt( Math.pow(B.x-A.x,2) + Math.pow(B.y-A.y,2) );
}

/*
 * Create an SVG point and apply a transformation matrix
 */
transformPoint = function(x, y, matrix) {
    var p = svg.createSVGPoint();
    p.x = x;
    p.y = y;
    return p.matrixTransform(matrix);
}

/*
 * Convert all segments of a path from relative to absolute coordinates
 * 
 * http://stackoverflow.com/questions/9677885/convert-svg-path-to-absolute-commands
 */
convertPathToAbsolute = function(path){
    
    if (path == null || path == undefined)
        return;
    
    var x0,y0,x1,y1,x2,y2;
    var segs = path.pathSegList;
    for (var x=0,y=0,i=0,len=segs.numberOfItems;i<len;++i){
        var seg = segs.getItem(i);
        var c = seg.pathSegTypeAsLetter;
        if (/[MLHVCSQTA]/.test(c)) {
            if ('x' in seg) x=seg.x;
            if ('y' in seg) y=seg.y;
        } else {
            if ('x1' in seg) x1=x+seg.x1;
            if ('x2' in seg) x2=x+seg.x2;
            if ('y1' in seg) y1=y+seg.y1;
            if ('y2' in seg) y2=y+seg.y2;
            if ('x'  in seg) x+=seg.x;
            if ('y'  in seg) y+=seg.y;
            switch(c) {
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
//      Record the start of a subpath
        if (c=='M' || c=='m')
            x0=x, y0=y;
    }
}

/*
 * Apply a transformation matrix onto
 * all segments of a path
 * (without modifying or removing the matrix)
 */
transformPath = function(path, matrix, debug) {
    
    if (path == null || path == undefined)
        return;
    
    var transform = function(x, y) {
        return transformPoint(x, y, matrix);
    }
    
    if (debug)
        console.log('Transforming path "'+path.id+'" ...');
    
    var segs = path.pathSegList;
    for (var i=0; i < segs.numberOfItems; i++) {
        var segment = path.pathSegList.getItem(i);
        var c = segment.pathSegTypeAsLetter;
        if (/[MLHVCSQTA]/.test(c)) {
            var new_segment = segment;
            switch(c) {
                case 'M':
                    var coord = transform(segment.x, segment.y);
                    var new_segment = path.createSVGPathSegMovetoAbs(coord.x, coord.y);
                    break;
                case 'L':
                    var coord = transform(segment.x, segment.y);
                    var new_segment = path.createSVGPathSegLinetoAbs(coord.x, coord.y);
                    break;
                case 'C':
                    var coord = transform(segment.x, segment.y);
                    var handle1 = transform(segment.x1, segment.y1);
                    var handle2 = transform(segment.x2, segment.y2);
                    var new_segment = path.createSVGPathSegCurvetoCubicAbs(coord.x, coord.y, handle1.x, handle1.y, handle2.x, handle2.y);
                    break;
            }
            if (new_segment != segment) {
                if (debug) {
                    console.log(segment);
                    console.log(new_segment);
                }
                segs.replaceItem(new_segment, i);
            }
        }
    }
}

/*
 * Apply the transform attribute of a path
 * onto the path segments and remove the attribute afterwards
 */
bakePathTransform = function(path, debug) {
    
    if (path == null || path == undefined)
        return;
    
    var t = path.getAttribute('transform');
    if (t != undefined && t != null && t.trim() != '') {
        if (debug)
            console.log(t);
        transformPath(path, path.transform.baseVal.consolidate().matrix);
        path.removeAttribute('transform');
        console.log('Path "'+path.id+'" transform baked in.')
    }
}

/*
 * Apply the transform attribute of a group
 * onto all child paths of this group recursively
 * and remove the attribute afterwards
 */
bakeGroupTransform = function(group, debug) {
    
    if (group == null || group == undefined)
        return;
    
    /*
     * Recursive transformation of group children
     */
    var baked = 0;
    transformChildren = function(group, matrix) {
        for (var i=0; i < group.childNodes.length; i++) {
            var child = group.childNodes[i];
            var childName = child.nodeName.toLowerCase();
            if (childName == 'path') {
                transformPath(child, matrix);
                baked += 1;
            }
            else if (childName == 'g')
                transformChildren(child, matrix);
        }
    }
    
    var t = group.getAttribute('transform');
    if (t != undefined && t != null && t.trim() != '') {
        if (debug)
            console.log(t);
        var matrix = group.transform.baseVal.consolidate().matrix;
        transformChildren(group, matrix);
        group.removeAttribute('transform');
        console.log('Group "'+group.id+'" transform baked into '+baked+' paths.');
    }
}

/*
 * Append rectangles to the SVG's top layer
 * to show where the path points are;
 * 
 * requires all transform attributes to be applied/removed beforehand 
 */
appendPathPointRects = function(path, prefixRectIds, addCssClass) {
    for (var i=0; i<path.pathSegList.numberOfItems; ++i){
        var segment = path.pathSegList.getItem(i);
//        console.log(i+': ');
//        console.log(segment);
        if (segment.pathSegType != SVGPathSeg.PATHSEG_CLOSEPATH)
            d3.select('#layer1')
                .append('rect')
                    .attr("id", prefixRectIds+i)
                    .attr("class", "pathPoint "+addCssClass)
                    .attr("x", parseFloat(segment.x)-4)
                    .attr("y", parseFloat(segment.y)-4)
                    .attr("width", 8)
                    .attr("height", 8)
                    .attr("tooltip", i);
    }
}

