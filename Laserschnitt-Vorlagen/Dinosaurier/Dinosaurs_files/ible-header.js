(function($) {
  var IbleHeader = function() {
    this.loggedIn = window.head.loggedin;
    this.header = $('#ible-header');
    this.headerInner = $('#ible-header-inner');
    this.headerToggle = $('#ible-header-toggle');
    this.ibleStepNav = $('#ible-steps-nav');
    this.jumpToNav = $('#jumpto-btngroup');
    this.jumpToBtn = $('#jump-to-step-btn');
    this.nextBtn = this.jumpToBtn.next();
    this.stepBtns = $('.jump-to-link')
    this.stepCount = $('#ible-steps-nav a.btn').size();
    this.viewAllStepsBtn = $('.view-all-steps-btn');
    this.voteDropdownToggle = $('#vote-dropdown-toggle');
    this.isMultiStepIble = this.ibleStepNav.length;
    this.currentStep = 0;
    this.allSteps = this.header.data('allsteps');
    this.onFirstPage = !!this.header.data('first-page');
    this.headerOffsetbottom = 0;
    this.headerOffsetTop = 0;
    this.initMultiStepIble();
    this.enableAjaxButtons();
    this.enableVoteDropdown();
    this.enableFixHeader();
  }
  
  IbleHeader.prototype = {
    constructor: IbleHeader,
    
    isFixed: function() {
      return this.header.hasClass('fixed');
    },
    
    isExpanded: function() {
      return this.header.hasClass('expanded');
    },

    cookie: function(name) {
      var re = new RegExp(name + "=([^;]+)"), value = re.exec(document.cookie); 
      return (value != null) ? unescape(value[1]) : null;
    },
        
    initMultiStepIble: function() {
      if (this.isMultiStepIble) {
        this.updateIntitialStep();
        this.positionStepNavTip();
        var stepNavCallback = $.proxy(this.jumpToNavClick, this);
        this.jumpToBtn.click(stepNavCallback);
        this.nextBtn.click(stepNavCallback);
        this.stepBtns.hover(
          function() {
            $(this).parent().addClass('open');
          },
          function() {
            $(this).parent().removeClass('open');
          }
        );
        
        if (this.allSteps)
          this.stepBtns.click($.proxy(this.goToStep, this));        
        this.jumpToNav.find('a').tooltip();
          
        if (this.loggedIn) {
          var ibleStepNavOpened = this.cookie('ibleStepNavOpened');
          if (ibleStepNavOpened == 1) {
            this.jumpToBtn.addClass('active');
            this.ibleStepNav.removeClass('collapsed');
          }
          this.viewAllStepsBtn.click($.proxy(this.viewAllStepsClick, this));
        }    
      }
    },
    
    positionStepNavTip: function() {
    	var jumpBtn = this.jumpToBtn,
    	    jumpX = jumpBtn.position().left,
    	    parentX = jumpBtn.parent().position().left,
    	    totalX = parentX+jumpX,
    	    stepNavTip = this.ibleStepNav.find('.bubble-tip');
        	stepNavTip.css({'left':totalX+45});
        	stepNavTip.show();      
    },
    
    updateIntitialStep: function() {
      var H = window.location.hash;
      if (H == '#intro') {this.currentStep = 0;}
      if (H == '#step1') {this.currentStep = 1;}      
    },
    
    jumpToNavClick: function(e) {
      var $btn = $(e.target),
          header = this.header,
          ibleStepNav = this.ibleStepNav,
          onFirstPage = this.onFirstPage,
          allSteps = this.allSteps;

      // clicking on the icon inside the button should also count as the button being clicked
      if (!$btn.hasClass('.btn'))
        $btn = $btn.closest('.btn');
        
      // If we are on the first page or browsing allsteps, we want the next button to go the next section on the page
      // If we are on the first page and we are not browing allsteps, we want the second click on the next button to go to the step2 url
      if (onFirstPage || allSteps) {
        e.preventDefault();

        if ($btn.hasClass('next') && !$btn.hasClass('disabled')) {
          if (onFirstPage && !allSteps && this.currentStep == 1) {
            window.location = $btn.attr('href'); 
            return;
          }             
          this.currentStep++;
          if (this.currentStep == this.stepCount-1)
            this.nextBtn.addClass('disabled');
          this.scrollToStep(this.currentStep);
        }
      }
      
      if ($btn.hasClass('steps-menu-toggle')) {
        document.cookie=(ibleStepNav.is(':hidden')) ? 'ibleStepNavOpened=1; path=/':"ibleStepNavOpened=0; path=/";
        this.positionStepNavTip();
        $btn.toggleClass('active');
        ibleStepNav.toggleClass('collapsed');
        header.parent().height(header.outerHeight());   
        this.headerOffsetbottom = this.headerOffsettop + header.height();
      }    
    },
    
    scrollToStep: function(stepIndex) {
      var anchorId = "stepanchor-step"+stepIndex;
      $(window).scrollTop($('#'+anchorId).offset().top-this.header.outerHeight());
      this.stepBtns.removeClass('active');
      $('#stepnav-step'+stepIndex).addClass('active');      
    },
    
    goToStep: function(e) {
      e.preventDefault();
      var currentStep = this.currentStep = $(e.target).data('stepindex'),
          stepCount = this.stepCount,
          nextBtn = this.nextBtn;
      if (currentStep == stepCount-1)
        nextBtn.addClass('disabled');
      if (currentStep > 0 && currentStep < stepCount-1)
        nextBtn.removeClass('disabled');
      this.scrollToStep(currentStep);      
    },
    
    viewAllStepsClick: function(e) {
      e.preventDefault();
      var $btn = $(e.target);   

      // clicking on the icon inside the button should also count as the button being clicked      
      if (!$btn.hasClass('.btn'))
        $btn = $btn.closest('.btn');
           
      document.cookie = $btn.hasClass('active') ? 'ibleAllSteps=0; path=/':'ibleAllSteps=1; path=/';
      $btn.toggleClass('active');
      window.location = $btn.attr('href');
    },
    
    enableAjaxButtons: function() {
      if (this.loggedIn) {
        this.header.find('.ajax-action-btn').ajaxActionBtn();
      } else {
        this.header.find('.ajax-action-btn').click(function(e){
          e.preventDefault();
          window.navoperator.makeLoginByJquery();          
        });
      }      
    },
    
    enableVoteDropdown: function() {
      if (this.voteDropdownToggle.length) {
        var self = this;
        this.voteDropdownToggle.click($.proxy(this.toggleVoteMenu, this));         
        head.js('/static/js/waypoints.min.js', $.proxy(this.toggleVoteMenuOnScroll, this));        
      }
    },
    
    toggleVoteMenu: function(e) {
      e.preventDefault();
      var parent = $(this.voteDropdownToggle).parent(),
          wasActive = parent.hasClass('open');
      parent.toggleClass('open');   

      if (wasActive) {
        this.hideVoteMenu();
      } else {
        $('html').on('click.vote-dropdown', function(e) {
          var target = $(e.target);
          if (target.closest('.vote-dropdown').length == 0) {
            parent.removeClass('open');
            $('html').off('click.vote-dropdown');            
          }
        });
      }
    },
    
    toggleVoteMenuOnScroll: function() {
      var self = this;
      $('#comments').waypoint(function(direction){
        if (direction === 'down') {
          self.voteDropdownToggle.click();
        } else {
          self.hideVoteMenu();
        }
      }, {offset: '100%'})
    },
        
    hideVoteMenu: function(e) {
      var menuToggleBtn = this.voteDropdownToggle,
          parent = menuToggleBtn.parent();
          
      if (parent.hasClass('open')) {
        parent.removeClass('open');
        $('html').off('click.vote-dropdown');
      }   
    },
    
    enableFixHeader: function() {
      var self = this,
          header = this.header,
          headerInner = this.headerInner,
          headerToggle = this.headerToggle,
          headerState, ibleHeaderCollapsed;

      ibleHeaderCollapsed = (this.cookie('ibleHeaderCollapsed') == 1);
      headerState = (ibleHeaderCollapsed) ? 'collapsed':'expanded';

      headerToggle.click(function(){
        var visible = headerInner.is(':visible');
        document.cookie=(visible) ? 'ibleHeaderCollapsed=1; path=/':"ibleHeaderCollapsed=0; path=/";    
        if (visible) {
          headerInner.slideUp('fast', function(){
            header.removeClass('expanded').addClass('collapsed');
            headerState = 'collapsed';
          });
        } else {
          headerInner.slideDown('fast', function() {
            header.removeClass('collapsed').addClass('expanded');
            headerState = 'expanded';
          });
        }     
      });
        
      window.setTimeout(function(){
        var updateFlag = true, 
            headerOffsettop = header.offset().top;
            
        self.headerOffsettop = headerOffsettop;
        self.headerOffsetbottom = headerOffsettop + header.height();
                    
        $(window).bind('scroll.ibleheader', function() {    
          var scrollTop = $(window).scrollTop();
          
          function fixHeader() {
      		  if (updateFlag) {
    		      header.parent().height(header.outerHeight());
      		    updateFlag = false;
        			header.addClass('header-gradient fixed ' + headerState);
        			headerToggle.show();
      			}        
          }
      
          function unfixHeader() {
    			  header.removeClass('header-gradient fixed ' + headerState);
      			headerToggle.hide();
      			updateFlag = true;
          }
      
          if ((header.hasClass('collapsed') || headerState == 'collapsed') && !header.hasClass('expanded')) {
        		if (scrollTop > self.headerOffsetbottom) {	  
        		  fixHeader();
        		  headerInner.hide();
      			} else {
              unfixHeader(); 			
              headerInner.show();
    			  }			  
    		  } else {
    		    if (scrollTop > self.headerOffsettop) {
    		      fixHeader();     
    		    } else {
    		      unfixHeader();
    		    }
    		  }
        });
      }, 750);            
    }
  }
  
  var ibleHeader = new IbleHeader();
})(window.jQuery);