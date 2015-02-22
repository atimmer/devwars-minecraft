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
    var scroll;
    var diff;
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
    var possibilities;
    
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

        maybeMakeHarder();
    }
    
    function clickBlock( e ) {
        var $this = $( e.currentTarget );
        
        if ( ! playing ) {
            return;
        }
        
        if ( $this.hasClass( 'grass' ) || $this.hasClass( 'ground' ) || $this.hasClass( 'stone' ) ) {
            $this.addClass('mined');
            lost();
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

    function lastRowDepth() {
        var $lastRow = $('.blockRow:last-child');
        var lastOffset = $lastRow.offset();

        return lastOffset.top;
    }

    function maybeMakeNewRow() {
        // If we need a new row make one
        if ( scroll + $(window).height() + 50 > lastRowDepth() ) {
            makeRow();
        }
    }
    
    function update() {
        scroll += diff;

        maybeMakeNewRow();
        maybeMakeHarder();
        
        $(window).scrollTop(scroll);
    }

    function maybeMakeHarder() {
        var depth = lastRowDepth();

        if ( depth > 300 ) {
            possibilities.stone = 0.4;
        }

        if ( depth > 1000 ) {
            possibilities.stone = 0.7;
            diff = 3;
        }

        if ( depth > 5000 ) {
            possibilities.stone = 0.95;
            possibilities.iron  = 0.2;
            possibilities.diamond = 0.01;
            possibilities.emerald = 0.001;
            diff = 4;

            diff = Math.floor( depth / 2500 + 2 );
        }

        // No ground after this depth
        if ( depth > 10000 ) {
            possibilities.stone = 1;
        }

        // This is already crazy fast, don't increase it more
        if ( diff > 12 ) {
            diff = 12;
        }
    }
    
    function tick( time ) {
        if ( playing ) {
            update();
        
            requestAnimationFrame(tick);
        }
    }
    
    function reset() {
        points = 0;
        scroll = 0;
        diff = 1;

        possibilities = {
            emerald: 0,
            diamond: 0,
            gold: 0.02,
            iron: 0.1,
            stone: 0.2,
            ground: 1
        };

        // Clear except the first row
        $('.blockRow').slice(1).remove();

        // Make initial rows
        for ( var i = 0; i < 40; i++ ) {
            makeRow();
        }
    }
    
    function start() {
        playing = true;
        
        requestAnimationFrame(tick);
    }

    function lost() {
        stop();
        alert('Lost! Points: ' + points + '.');
        $('body').animate({scrollTop:0},'750');
    }
    
    function stop() {
        playing = false;
    }
    
    function init() {
        
        $game = $( '.gameView' );

        reset();
        start();
        stop();
        
        $(window).on( 'DOMMouseScroll', function(e) {
            e.preventDefault();
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
