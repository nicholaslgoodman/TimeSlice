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
	document.getElementById("timeBoxes").style.border="1px solid black";
	document.getElementById("breaks").style.border="1px solid black";
	document.getElementById("timeBoxes").style.padding="2px";
	document.getElementById("breaks").style.padding="2px";
	   
    function TimeSlice (audioFile, options) {
    /*
     * Time Slice is a child of Tock and adds some new functions
     * @param audioFile should be a valid string to the path of a valid audio file
     * @param options is passed to Tock 
     */
    	
	Tock.call(this, options);	
	this.sliceCount = 0;
	this.breakCount = 0;
	this.running = false;
	this.onShortBreak = true;
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
  		
  		if (this.running) {
  			this.running = false;  			
  			this.stop($('#time_left').val());        	
        }
        else {
        	this.running = true; 		
			this.start($('#time_left').val());
        }
};
 
TimeSlice.prototype.reset = function(){
	/*
	 * Replaces Tock's function with behavior more appropriate to slice
	 */
        this.stop();
	    this.running = false;
	    this.onLongBreak = false;
	    this.onShortBreak = true;
        this.sliceCount = 0;
        this.breakCount = 0;
        $('#time_left').val($('#box_duration').val());
        $('#timeBoxes').text(this.sliceCount);
        $('#breaks').text(this.breakCount);
 };
     
TimeSlice.prototype.playAlarm = function(){
	if (!$('#mute').is(':checked')){
		this.alarmAudio.play();
	};
};

TimeSlice.prototype.pauseAlarm = function(){
	this.alarmAudio.pause();
	};
	
TimeSlice.prototype.work = function(){
	this.start($('#box_duration').val());
	this.onShortBreak = true;	
};

TimeSlice.prototype.shortBreak = function(){	
	this.start($('#break_short').val());
	this.onShortBreak = false;
};

TimeSlice.prototype.longBreak = function(){		
	this.start($('#break_long').val());
};

TimeSlice.prototype.chooseMode = function(){
	/*
	 * Most of the logic is stored here for now
	 */
	

		
	if (this.onShortBreak){
		this.sliceCount++;
		if (this.sliceCount >= $('#box_iter').val()){			
			this.onShortBreak = false;
			this.onLongBreak = true;
			this.longBreak();
		}
		else {
		this.shortBreak();
		}
	}
	else if (this.onLongBreak){
		this.reset();
	}
	else{
		this.breakCount++;		
		this.work();
	}
	    	
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
        if (MySlice.onLongBreak){
        	MySlice.reset();  
        	}
        else{      
			MySlice.chooseMode();
		}            
    }
});

	// temporary method of handling buttons.
	$('#start_button').on('click', function () {
  		MySlice.playPause();
    });
    
	$('#reset_button').on('click', function () {
		MySlice.reset();       
    });
    
    $('#mute_button').on('click', function () {
    	if($('#mute').is(':checked')){    		
      		$('#mute').prop('checked', false);
      	}
      	else{
      		$('#mute').prop('checked', true);
      		MySlice.pauseAlarm();      		
      	}
     
    });
   
};