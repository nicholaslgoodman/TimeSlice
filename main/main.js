/**
 * TimeSlice by Nicholas L. Goodman
 * Allows basic "timebox" time management for increased productivity. 
 * Licensed under GPL.
 * https://gnu.org/licenses/gpl-3.0.txt
 * Cuckoo Sound Effect by MorgantJ under a Creative Commons License
 * http://creativecommons.org/licenses/by/3.0/legalcode
 * http://freesound.org/people/morgantj/sounds/58628/
 * Tock provided by Mr Chimp under the MIT License
 */


window.onload = function() {
	
	document.getElementById("timeBoxes").style.border="1px solid gray";
	document.getElementById("breaks").style.border="1px solid gray";
	document.getElementById("timeBoxes").style.padding="2px";
	document.getElementById("breaks").style.padding="2px";
	
	// evil global variables, fix later
	var boxes = 0;
	var breaks = 0;
	var completed = false;
	var box_duration = $('#box_duration').val();
	var count = 0;
	var iter = 4;
	var iter_original = 4;
	var short_break_duration = $('#break_short').val();
	var long_break_duration = $('#break_long').val();
	var on_short_break = false;
	var on_long_break = false;
	
	// tock *bizarrely* has no "get_state" or similar
	var isRunning = false;
	var isPaused = false;
	
	var cuckoo = new Audio('cuckoo.mp3');
	
	function proceed () {
		
		if (boxes >= iter){
			on_long_break = true;
			on_short_break = false;
		}
		
		if (on_short_break){			
			breaks++;
			//$('#time_left').val($('#break_short').val());
			timebox.start($('#break_short').val());
			on_short_break = false;			
		}
		else if (on_long_break){
			//cuckoo.play();
			breaks = 0;
			boxes = 0;			
			//$('#time_left').val($('#break_long').val());
			timebox.start($('#break_long').val());
			on_long_break = false;
			iter = iter_original;
		}
		else {
			boxes++;
			//$('#time_left').val($('#box_duration').val());
			timebox.start($('#box_duration').val());
			on_short_break = true;
			
		};       
    	
         $('#timeBoxes').text(boxes);
         $('#breaks').text(breaks);
	   };
	   
    var timebox = Tock({
    	countdown: true,
        interval: 250,
        callback: function () {
            console.log(timebox.lap() / 1000);
            $('#time_left').val(timebox.msToTime(timebox.lap()));
        },
        complete: function () {
            console.log('end');
            cuckoo.play();         
			proceed();            
           }
    });
    
    
    // tock has no "play/pause" function
  $('#start_box').on('click', function () {
  		cuckoo.pause();
  		if (isRunning) {
  			isRunning = false;
  			isPaused = true;
  			timebox.stop($('#time_left').val());        	
        }
        else {
        	isRunning = true; 		
			timebox.start($('#time_left').val());
        }
    });
    
    $('#reset_box').on('click', function () {
    	isRunning = false;
        timebox.stop();
        $('#time_left').val($('#box_duration').val());
        boxes = 0;
        breaks = 0;
        $('#timeBoxes').text(boxes);
        $('#breaks').text(breaks);
        
    });
      
    
};
