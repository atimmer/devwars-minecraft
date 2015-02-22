/**
 * Team Red, JavaScript
 * type your comment here
 * [insert funny joke here]
 **/
 
 /*   
      ROFL:ROFL:LOL:ROFL:ROFL
          ______/|\____
    L    /          [] \
   LOL===_      ROFL    \_
   L     \_______________]
              I      I
         /---------------/ 
         
*/

;(function($) {
    
    var $game;
    var scroll = 3;
    var diff = 3;
    var template = '<div class="blockRow">'
    + '{{#each rows}}'
    + '<div class="block {{class}}"></div>'
    + '{{/each}}'
    + '</div>';
    template = Handlebars.compile(template);

    var pointsDist = {
        iron: 10,
        gold: 20,
        diamond: 100,
        emerald: 500
    };
    var possibilities = {
        emerald: 0.001,
        diamond: 0.005,
        gold: 0.02,
        iron: 0.1,
        stone: 0.4,
        ground: 1
    };
    
    var points = 0;
    
    var playing = false;
    
    function generateRow() {
        var rnd;
        
        var row = [];
        for ( var i = 0; i < 9; i++ ) {
            
            $.each( possibilities, function( key, possible ) {
               rnd = Math.random();
               
               if ( rnd <= possible ) {
                    row.push( key );
                    return false;
               }
            });
        }
        
        return row;
    }
    
    function makeRow() {
        var row = generateRow();
        var html = '';
        
        row = $.map(row, function(item) {
        
            
            return {
                class: item
            };
        });
        
        html = template({
            rows: row
        });
        
        $game.append( html );
        
    }
    
    function clickBlock( e ) {
        var $this = $( e.currentTarget );
        
        if ( ! playing ) {
            return;
        }
        
        if ( $this.hasClass( 'grass' ) || $this.hasClass( 'ground' ) || $this.hasClass( 'stone' ) ) {
            $this.addClass('mined');
            stop();
        } else if ( $this.hasClass( 'mined' ) ) {
            
        } else {
            var pointDiff = pointsDist[ $this.prop('class').replace('block ', '') ];
        
            points += pointDiff;
            
            $this.addClass('mined');
            
            updateScore();
        }
    }
    
    function addCursorClass() {
        $('body').addClass('click');
    }
    
    function removeCursorClass() {
        $('body').removeClass('click');
    }
    
    function updateScore() {
        $('.score').html(points);
    }

    function maybeMakeNewRow() {
        var $lastRow = $('.blockRow:last-child');
        var lastOffset = $lastRow.offset();

        // If we need a new row make one
        if ( scroll + $(window).height() + 50 > lastOffset.top ) {
            makeRow();
        }
    }
    
    function update( time ) {
        scroll += diff;

        maybeMakeNewRow();
        
        if ( time > 5000 ) {
            diff = 6;
        }
        
        if ( time > 10000 ) {
            diff = 9;
            
            possibilities = {
                emerald: 0.005,
                diamond: 0.01,
                gold: 0.04,
                iron: 0.2,
                stone: 0.7,
                ground: 1
            };
        }
        
        if ( time > 15000 ) {
            diff = 12;
        }
        
        if ( time > 20000 ) {
            diff = 15;
        }
        
        $(window).scrollTop(scroll);
    }
    
    function tick( time ) {
        if ( playing ) {
            update( time );
        
            requestAnimationFrame(tick);
        }
    }
    
    function reset() {
        points = 0;
        scroll = 0;

        // Clear except the first row
        $('.blockRow').slice(1).remove();

        // Make initial rows
        for ( var i = 0; i < 40; i++ ) {
            makeRow();
        }
    }
    
    function start() {
        playing = true;

        $('body').removeClass('allow-scroll');
        
        requestAnimationFrame(tick);
    }
    
    function stop() {
        playing = false;
        
        alert('Lost! Points: ' + points + '.');

        $('body').addClass('allow-scroll');
    }
    
    function init() {
        
        $game = $( '.gameView' );
        
        reset();
        start();
        
        $(window).on( 'DOMMouseScroll', function(e) {
            if ( playing ) {
                e.preventDefault();
            }
        });
        
        $(window).on('mousedown', addCursorClass);
        $(window).on('mouseup', removeCursorClass);
        
        $('body').on( 'mousedown', '.block', clickBlock );
        
        $('.startScreen button').on('click', function() {
             if ( ! playing ) {
                 reset();
                 start();
             }
        });
    }
    $(init);
    
    // for( var i = 0; i < 200; i++ ) {
    //     var j = i + 2;
        
    //     setTimeout(function() {
    //       diff = j; 
    //     }, diff * 500);
    // }
    
}(jQuery));
 /*
 stop(); // Hammertime!
 
  Theme		
Minecraft Endless Scroll Mini-Game	

Objectives		
1. Pickaxe cursor that has a impact-hit animation when you click (i.e. rotate)		
2. create rows of minecraft blocks (50x50px) that consist of 9 blocks in each row. The first row of blocks must be grass blocks and above that must be blue sky with clouds		
3. Page slowly and automatically scrolls down (manual scroll is disabled) loading more blocks as it scrolls		
4. Randomly generate iron, gold, diamond and emerald ores amongst the general dirt & stone blocks that you can click on and mine for points.		
5. Add a point score that tallies up the points earned in the game. You lose the game by misclicking on stone/dirt		

Bonus		
Create a "start game" button at the start of the page that starts the game 	
*/