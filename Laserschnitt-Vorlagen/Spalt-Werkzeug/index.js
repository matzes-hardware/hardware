
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
 * Slots need to be grouped with their corresponding pieces (<g>).
 * 
 * Top level must be <g id="layer1">.
 * 
 * SVG id must be "svg".
 */

load = function() {
    $('#view').html('');
    
    // Open selected file
    var files = $('#fileSVG')[0].files;
    if (files.length === 0) {
//        alert('Please choose a file to be loaded.');
        return;
    }
    $('#body').css('cursor','wait');

    var file = files[0];
    // Create an instance of the file reader and jSBGN.
    var reader = new FileReader();
    // This event handler is called when the file reading task is complete
    reader.onload = function (read) {
        // Get the data contained in the file
        loaded(read.target.result);
    };
    reader.readAsText(file);
}

loaded = function(data) {
    $('#body').css('cursor','auto');
    
    if (data.indexOf('<?xml') > -1) {
        // cut off XML header
        var data = data.substr(data.indexOf('<svg'));
    }
    $('#view').append($(data));
    
    absolutizeCoordinates();
}

absolutizeCoordinates = function() {
    var svg = document.getElementById('svg');
    
    allPaths = svg.getElementsByTagName('path');
    for (var i=0; i<allPaths.length; i++) {
        convertPathToAbsolute(allPaths[i]);
        bakePathTransform(allPaths[i]);
    }

    var allGroups = svg.getElementsByTagName('g');
    // for some reason the following seems not to work when counting up
    for (var i=allGroups.length-1; i>=0; i--) {
        bakeGroupTransform(allGroups[i]);
    }
    
    window.setTimeout(identifyPieces, 100);
}

identifyPieces = function() {
    allPiecePaths = [];
    allSlotPaths = [];
    for (var i=0; i<allPaths.length; i++) {
        if (allPaths[i].pathSegList.numberOfItems > 2) {
            var p = Piece(allPaths[i]);
            if (p.slotPaths.length > 0)
                allPiecePaths.push(p);
        } else
            allSlotPaths.push(allPaths[i]);
    }
    console.log(allPaths.length+' paths identified: '+allPiecePaths.length+' pieces, '+allSlotPaths.length+' slots');
}

cutSlots = function() {
    for (var i=0; i<allPiecePaths.length; i++) {
        allPiecePaths[i].cutSlots();
    }
}

//open a new tab with the modified SVG
exportSVG = function() {
    $('.pathPoint').remove();
    window.open("data:image/svg+xml," + encodeURIComponent( $('#view').html() ), 'tmp');
}
