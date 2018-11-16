/**
 * TimeSlice by Nicholas L. Goodman
 * Allows basic "timebox" time management for increased productivity. 
 * Licensed under GPL.
 * https://gnu.org/licenses/gpl-3.0.txt
 * 
 * Tock provided by Mr Chimp under the MIT License
 */

// note: must import tock.js

window.onload = function() {
	/*
	 * This is our main function. We might want to break this up eventually
	 */
	
	// temporary style code

	   
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
	this.shortBreakTime = '5:00';
	this.longBreakTime = '20:00';
	this.sliceTimeLeft='25:00';
	this.sliceDuration='25:00';
	this.sliceLimit=4;
	this.reset();
	$('#sliceDuration').html(this.sliceDuration);
	$('#breakLong').html(this.longBreakTime);
	$('#breakShort').html(this.shortBreakTime);
	
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
  			this.stop($('#timeLeft').text());        	
        }
        else {
        	this.running = true; 		
			this.start($('#timeLeft').text());
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
		
		$('#timeLeft').html(this.sliceTimeLeft);
		$('#timeSlices').html(this.sliceCount);

        $('#breaks').html(this.breakCount);
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
	this.start(this.sliceTimeLeft);
	this.onShortBreak = true;	
};

TimeSlice.prototype.shortBreak = function(){	
	this.start(this.shortBreakTime);
	this.onShortBreak = false;
};

TimeSlice.prototype.longBreak = function(){		
	this.start(this.longBreakTime);
};

TimeSlice.prototype.chooseMode = function(){
	/*
	 * Most of the logic is stored here for now
	 */
	if (this.onShortBreak){
		this.sliceCount++;
		if (this.sliceCount >= this.sliceLimit){			
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
	    	
	$('#timeSlices').text(this.sliceCount);
    $('#breaks').text(this.breakCount);
};
   
var AUDIO_FILE = "media/chime.wav";

var MySlice = new TimeSlice(AUDIO_FILE, {
    countdown: true,
    interval: 250,
    callback: function () {    	
    	$('#timeLeft').html(MySlice.msToTime(MySlice.lap()));
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
	$('#startButton').on('click', function () {
  		MySlice.playPause();
    });
    
	$('#resetButton').on('click', function () {
		MySlice.reset();       
    });
    
    $('#muteButton').on('click', function () {
    	if($('#mute').is(':checked')){    		
      		$('#mute').prop('checked', false);
      	}
      	else{
      		$('#mute').prop('checked', true);
      		MySlice.pauseAlarm();      		
      	}
     
    });
};