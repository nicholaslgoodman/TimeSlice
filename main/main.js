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

// note: must import tock.js

window.onload = function() {
	/*
	 * This is our main function.
	 */
	
	// temporary style code
	document.getElementById("timeBoxes").style.border="1px solid gray";
	document.getElementById("breaks").style.border="1px solid gray";
	document.getElementById("timeBoxes").style.padding="2px";
	document.getElementById("breaks").style.padding="2px";
	   
    function TimeSlice (audioFile, options) {
    /*
     * Time Slice is a child of Tock and adds some new functions
     * @param audioFile should be a valid string to the path of a valid audio file
     * @param options is passed to Tock 
     */
    	
	Tock.call(this, options);
	
	this.timeLeft = 25;
	this.sliceCount = 0;
	this.sliceDuration = $('#box_duration').val();
	this.shortBreakDuration = $('#break_short').val();
	this.shortBreakCount = 0;
	this.longBreakDuration = $('#break_long').val();
	this.running = false;
	this.iterations = 4;
	this.iterationsOriginal = 4;
	this.onShortBreak = false;
	this.onLongBreak = false;
	this.alarmAudio = new Audio(audioFile);
	
};

TimeSlice.prototype = Object.create(Tock.prototype);

TimeSlice.prototype.constructor = TimeSlice;

TimeSlice.prototype.isRunning = function(){
	/*
	 * Tock does not have a similar function, and we need it
	 */
	return this.running;
};

TimeSlice.prototype.playPause = function(){
	/*
	 * this combines the start/stop/pause functions of Tock into one; simple
	 */
	
  		this.pauseAlarm();
  		
  		if (this.running) {
  			this.running = false;  			
  			MySlice.stop($('#time_left').val());        	
        }
        else {
        	this.running = true; 		
			MySlice.start($('#time_left').val());
        }
};
 
TimeSlice.prototype.reset = function(){
	/*
	 * Replaces Tock's function with behavior more appropriate to slice
	 */
	    this.running = false;
        MySlice.stop();
        $('#time_left').val($('#box_duration').val());
        this.sliceCount = 0;
        this.breakCount = 0;
        $('#timeBoxes').text(this.sliceCount);
        $('#breaks').text(this.breakCount);
 };  
     
TimeSlice.prototype.playAlarm = function(){
	this.alarmAudio.play();
	};

TimeSlice.prototype.pauseAlarm = function(){
	this.alarmAudio.pause();
	};


TimeSlice.prototype.proceed = function(){
	/*
	 * Most of the logic is stored here for now
	 */
	
	if (this.sliceCount >= this.iterations){
			this.onLongBreak = true;
			this.onShortBreak = false;
		}
		
		if (this.onShortBreak){			
			this.breakCount++;
			MySlice.start($('#break_short').val());
			this.onShortBreak = false;			
		}
		
		else if (this.onLongBreak){			
			this.breakCount = 0;
			this.sliceCount = 0;			
			MySlice.start($('#break_long').val());
			this.onLongBreak = false;
			this.iterations = this.iterationsOriginal;
		}
		else {
			this.sliceCount++;
			MySlice.start($('#box_duration').val());
			this.onShortBreak = true;			
		};       
    	
         $('#timeBoxes').text(this.sliceCount);
         $('#breaks').text(this.breakCount);
	   };
   
var AUDIO_FILE = "media/cuckoo.mp3";

var MySlice = new TimeSlice(AUDIO_FILE, {
    countdown: true,
    interval: 250,
    callback: function () {    	
    	$('#time_left').val(MySlice.msToTime(MySlice.lap()));
    },
    complete: function () {
        console.log('end');
        MySlice.playAlarm();         
		MySlice.proceed();            
    }
});

	// temporary method of handling buttons.
  $('#start_box').on('click', function () {
  		MySlice.playPause();
    });
    
    $('#reset_box').on('click', function () {
		MySlice.reset();       
    });
      
   
};