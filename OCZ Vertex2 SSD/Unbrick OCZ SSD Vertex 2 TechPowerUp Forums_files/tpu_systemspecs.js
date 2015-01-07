$(document).ready(function() {
  $('body').on('click', 'a.specslink', function(e) { 
    e.preventDefault();
    e.stopPropagation();

    var tblTarget=$(this).parent().next('.specstable');
    
    // Hide if clicked link on open table
    if (tblTarget.is(":visible")) {
      $('.specstable').hide().prev().find('a').removeClass('up').addClass('down');
      return;          
    }
    
    // Hide any open tables
    $('.specstable:visible').hide().prev().find('a').removeClass('up').addClass('down');
    
    tblTarget.css('top', $(this).parents('.messageUserBlock').height()+5).slideDown(200);
    tblTarget.prev().find('a').removeClass('down').addClass('up');
  });
  
  $(document).click(function(e) { 
    var container=$('.specstable:visible');
    if (container.length==0)
      return;
      
    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        container.hide().prev().find('a').removeClass('up').addClass('down');
    }  
  });
});