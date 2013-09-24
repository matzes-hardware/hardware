
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
    $('#body').css('cursor','wait');
    $('#svg').remove();
    
    // Open selected file
    var files = $('#fileSVG')[0].files;
    if (files.length === 0) {
        alert('Please choose a file to be loaded.');
        return;
    }
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
    $('#body').append($(data));
    
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

