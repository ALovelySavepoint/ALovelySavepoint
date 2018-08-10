//adds command names to recognized ChoiceScript library
Scene.validCommands.se_volume = 1;
Scene.validCommands.se_sound = 1;
Scene.validCommands.se_fade_in = 1;
Scene.validCommands.se_fade_out = 1;
Scene.validCommands.se_pause = 1;
Scene.validCommands.se_unpause = 1;
Scene.validCommands.se_stop = 1;
Scene.validCommands.se_stop_all = 1;
 
var mainVolume = 0; //creates a global variable called mainVolume and sets it to zero. "global" means it can be used and edited in all functions
 
Scene.prototype.se_volume = function setVolume(input){ //creates a command called se_volume
  var input_array = input.split(" "); //splits the player's input at each space into an array of strings
  var volume = input_array[0]; //assigns first split string to variable volume
  var id = input_array[1]; //assigns second split string to variable id
  var audio = document.getElementById(id); //gets sound from ID and sets it to audio
  if (volume >= 0 && volume <= 1) { //checks if volume is a number between 0 and 1
    if (audio != null) { //checks whether audio was specified
      audio.volume = volume; //sets audio's volume to volume
      audio.manual = "yes" //applies an attribute to the sound that it's been manually set
    }
    else { //if audio wasn't specified, but a volume between 0 and 1 was
      mainVolume = volume; //sets mainVolume to volume
      var audios = document.getElementsByTagName('audio') //retrieves all audio elements and puts them in variable audios
      var i, n = audios.length; //preps the following code to work on audios
      for (i = 0; i < n; ++i) { //runs following code on every element in audios
        if (audios[i].manual != "yes") { //checks if audio element is manually set, might need getAttribute
          audios[i].volume = mainVolume; //sets volume of audio element to mainVolume
        }
      }
    }
  }
  else if (volume == "reset" && audio != null) { //if volume isn't between 0 and 1, checks if volume is "reset" and if audio was specified
    audio.volume = mainVolume; //sets audio's volume to mainVolume
    audio.manual = "pseudonull"; //if present, removes the manual attribute from audio
  }
  else if (volume != "reset" && volume < 0 && volume > 1) { //if none of the above, checks if volume input was valid
    window.alert("Error: se_volume isn't between 0 and 1 or isn't reset. Volume input: " + volume); //spits error message
  }
  else if (volume == "reset" && id == null) { //if none of the above, checks if volume is "reset" and no id specified
    window.alert("Error: se_volume told to reset volume, but no ID given.") //spits error message
  }
}
 
Scene.prototype.se_sound = function startSound(input){ //creates a command called se_sound
  var input_array = input.split(" "); //splits the player's input at each space into an array of strings
  var name = input_array[0]; //assigns first split string to variable name
  var id = input_array[1]; //assigns second split string to variable id
  var loop = input_array[2]; //assigns third split string to variable loop
  var volume = input_array[3]; //assigns fourth split string to variable volume
  var exists = document.getElementById(id); //retrieves any element of the specified ID, and sets it to the variable exists
  if (name.indexOf("http") != 0) { //checks if name doesn't start with "http", aka isn't a link
    var loc = window.location.href //finds current file path and sets it to variable loc
    loc = loc.slice(0, -17); //removes "mygame/index.html" from loc
    loc = loc + "audio/" + name; //adds "audio/${filename}" to loc
  }
  else { //if name is a url, does this
    var loc = name; //sets loc to name
  }
  if (volume >= 0 && volume <= 1) { //checks if volume is between 0 and 1
    var finalVolume = volume //sets finalVolume to volume
  }
  else if (volume == null) { //if no volume was given
    var finalVolume = mainVolume //sets finalVolume to mainVolume
  }
  else { //if volume given but not between 0 and 1, or not a number
    window.alert("Error: se_sound given invalid volume. Input: " + volume) //spits error message
  }
  if (exists == null) { //makes sure ID isn't already taken. prevents duplicate IDs, i.e. player comes back from stats screen and reruns this command
    var audio = document.createElement('audio'); //creates an element of the audio tag and sets it to the variable audio
    audio.style.display = "none"; //sets music UI. should be kept to "none" 
    audio.src = loc; //sets location of audio
    audio.loop = loop; //boolean, loops on true
    audio.volume = finalVolume; //number from finalVolume
    audio.id = id //string, unique identifier for manipulating the element later
    audio.autoplay = true; //determines whether the audio plays as soon as it loads. should be kept true
    audio.onended = function(){ //checks if song has finished 
      audio.remove() //kills audio, frees up ID
    };
    if (volume >= 0 && volume <= 1) { //if passed ID check and volume was manually specified
      audio.manual = "yes" //applies an attribute to the sound that it's been manually set
    }
    document.body.appendChild(audio); //adds audio to document
  }
}
 
Scene.prototype.se_fade_in = function fadeInPV(input, startVolume, desiredVolume, crossfadeSpeed){ //creates a command called se_fade_in_pv
  var input_array = input.split(" "); //splits the player's input at each space into an array of strings
  var id = input_array[0]; //assigns first split string to variable id
  var volume = input_array[1]; //assigns second split string to variable volume
  var audio = document.getElementById(id); //gets sound from ID and sets it to audio
  if (startVolume == null && audio != null && audio.fade != "yes") { //checks if this is the first time running through this code by checking if variable startVolume has been set already. also checks whether audio exists and if it's already fading somewhere else
    audio.fade = "yes" //adds an attribute to audio that it's currently fading. used to avoid conflicts
    var startVolume = audio.volume; //sets startVolume to audio's current volume
    if (volume > 0 && volume <= 1) { //checks if volume is between 0 and 1
      var desiredVolume = volume //sets desiredVolume to volume. sound will fade up until it matches volume
    }
    else { //if volume is null or it wasn't between 0 and 1
      var desiredVolume = mainVolume //sets desiredVolume to mainVolume. sound will fade up until it matches mainVolume
    }
    var crossfadeSpeed = (Math.abs(startVolume - desiredVolume) / 100); //sets crossfadeSpeed (how much volume is lowered every tick) to 1/100th the distance between startVolume and desiredVolume.
  }
  if (desiredVolume != null) { //checks whether a desiredVolume has been set, as a way to tell if another fade is already in progress.
    var currentVolume = audio.volume; //gets volume from audio and sets it to currentVolume
    if (currentVolume < desiredVolume) { //checks if current volume is less than desiredVolume
      audio.volume += crossfadeSpeed //increases audio's volume by crossfade
      setTimeout(fadeInPV, 100, input, startVolume, desiredVolume, crossfadeSpeed); //reruns function every 0.1 seconds, passing along the variables startVolume, desiredVolume, and crossfadeSpeed
    }
    else if (currentVolume <= desiredVolume) { //checks whether fade completed
      audio.fade = "pseudonull" //removes the fade attribute from audio
    }
  }
}
 
Scene.prototype.se_fade_out = function fadeOutPV(input, startVolume, desiredVolume, crossfadeSpeed){ //creates a command called se_fade_out_pv
  var input_array = input.split(" "); //splits the player's input at each space into an array of strings
  var id = input_array[0]; //assigns first split string to variable id
  var volume = input_array[1]; //assigns second split string to variable volume
  var audio = document.getElementById(id); //gets sound from ID and sets it to audio
  if (startVolume == null && audio != null && audio.fade != "yes") { //checks if this is the first time running through this code by checking if variable startVolume has been set already. also checks whether audio exists and if it's already fading somewhere else
    audio.fade = "yes" //adds an attribute to audio that it's currently fading. used to avoid conflicts
    var startVolume = audio.volume; //sets startVolume to audio's current volume
    if (volume > 0 && volume <= 1) { //checks if volume is between 0 and 1
      var desiredVolume = volume //sets desiredVolume to volume. sound will fade down until it matches volume
    }
    else { //if volume is null or it wasn't between 0 and 1
      var desiredVolume = 0 //sets desiredVolume to 0. sound will fade down until it matches 0
    }
    var crossfadeSpeed = (Math.abs(startVolume - desiredVolume) / 100); //sets crossfadeSpeed (how much volume is lowered every tick) to 1/100th the distance between startVolume and desiredVolume.
  }
  if (desiredVolume != null) { //checks whether a desiredVolume has been set, as a way to tell if another fade is already in progress.
    var currentVolume = audio.volume; //gets volume from audio and sets it to currentVolume
    if (currentVolume < 0.005 && !(volume > 0) && !(volume <= 1)) { //checks if volume wasn't specified and if audio is very quiet
      audio.remove(); //removes audio
    }
    else if (currentVolume > desiredVolume) { //checks if currentVolume is greater than desiredVolume
      audio.volume -= crossfadeSpeed //decreases audio's volume by crossfade
      setTimeout(fadeOutPV, 100, input, startVolume, desiredVolume, crossfadeSpeed); //reruns function every 0.1 seconds, passing along the variables startVolume, desiredVolume, and crossfadeSpeed
    }
    else if (currentVolume <= desiredVolume) { //checks whether fade completed
      audio.fade = "pseudonull" //removes the fade attribute from audio
    }
  }
}
 
Scene.prototype.se_pause = function pauseSound(id){ //creates a command called se_pause
  var audio = document.getElementById(id); //gets sound from ID and sets it to audio
  if (audio != null) { //checks whether audio exists (you can't pause the music if a song don't exist)
    audio.pause() //pauses audio
  }
}
 
Scene.prototype.se_unpause = function unpauseSound(id){ //creates a command called se_unpause
  var audio = document.getElementById(id); //gets sound from ID and sets it to audio
  if (audio != null) { //checks whether audio exists (you can't pause the music if a song don't exist)
    audio.play() //pauses audio
  }
}
 
Scene.prototype.se_stop = function stopSound(id){ //creates a command called se_stop
  var audio = document.getElementById(id); //gets sound from ID and sets it to audio
  if (audio != null) { //checks whether audio exists (you can't stop the music if a song don't exist)
    audio.remove() //kills audio, frees up ID
  }
}
 
Scene.prototype.se_stop_all = function stopAllSounds(){ //creates a command called se_stop_all
  var audios = document.getElementsByTagName('audio') //retrieves all audio elements and puts them in variable audios
  while (audios[0]) audios[0].parentNode.removeChild(audios[0]) //removes all elements from variable audios
}
 
Scene.prototype.se_volume_by_id = function muteSound(input){ //creates a command called se_volume_by_id
  var input_array = input.split(" "); //splits the player's input at each space into an array of strings
  var volume = input_array[0]; //assigns first split string to variable volume
  var id = input_array[1]; //assigns second split string to variable id
  var audio = document.getElementById(id); //gets sound from ID and sets it to audio
  if (audio != null) { //checks whether audio exists (you can't mute the music if a song don't exist)
    audio.volume = volume; //sets audio's volume to volume
  }
}