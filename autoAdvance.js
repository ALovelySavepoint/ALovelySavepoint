// ChoiceScript (c) Dan Fabulich
// autoAdvance.js - Malebranche @ www.choiceofgames.com/forum
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this file, to utilize it without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
//  * The 'usage' of this file is kept within compliance of the 'ChoiceScript License'.
//    You can obtain a copy of the license at http://www.choiceofgames.com/LICENSE-1.0.txt
//  
//  * The copyright, attributions and permission notices must be retained 
//    within all copies of the code (modified or otherwise).

//  *Unless required by applicable law or agreed to in writing, the
//    licensor provides the work on an "AS IS" BASIS, WITHOUT WARRANTIES OR
//    CONDITIONS OF ANY KIND, either express or implied, including, without
//    limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT,
//    MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely
//    responsible for determining the appropriateness of using or
//    redistributing the works and assume any risks associated with your
//    exercise of permissions under this license.
//
//  * In no event and under no legal theory, whether in tort (including
//	  negligence), contract, or otherwise, unless required by applicable law
//    (such as deliberate and grossly negligent acts) or agreed to in
//    writing, shall the licensor be liable to you for damages, including
//    any direct, indirect, special, incidental, or consequential damages of
//    any character arising as a result of this license or out of the use or
//    inability to use the works (including but not limited to damages for
//    loss of goodwill, work stoppage, computer failure or malfunction, or
//    any and all other commercial damages or losses), even if the licensor
//    has been advised of the possibility of such damages.


/*Validate new CS commands*/
Scene.validCommands.auto = 1;
Scene.validCommands.countdown = 1;
Scene.validCommands.overarch = 1;
Scene.validCommands.statscreencheck = 1;
Scene.validCommands.oastatscreencheck = 1;
Scene.validCommands.cleartimer = 1;
Scene.validCommands.re = 1;
Scene.validCommands.timetransmodify = 1;

/*Support Functions*/
function getNextButton(){
	/*Get the next button, and do it so that it's compatible all the way back to IE5 with GEByTagname 
	(The next button will always be the last button on the page unless someone messes with the actual index.html file 
	and adds a <button> element under the area where the next button appears) */
	var buttonsonpage = document.getElementsByTagName('button');
	/*Arrays are 0-index based, unlike the .length property so we need to subtract one from the .length property 
	and we'll have the proper key that represents the next button element*/
	var nxtnum = buttonsonpage.length -1;
	/*Return the next button*/
	return buttonsonpage[nxtnum];
}
function resetButton(elementtounlink, contenttounlink){
	var currentonclick = elementtounlink.getAttribute('onclick');
	var newonclick = document.createAttribute("onclick");
	var newonclickval = currentonclick.split(";");
	for(thing in newonclickval){
		if(newonclickval[thing] === contenttounlink){
			newonclickval.splice(thing, 1);
		}
	}
	newonclick.value = newonclickval.join(";");
	elementtounlink.setAttributeNode(newonclick);
}
function setOnclicks(elementtoonclick,onclickcontents){
	var previousonclick = elementtoonclick.getAttribute('onclick');
	if(previousonclick){
	var newonclickval = previousonclick.split(";");
		for(thing in newonclickval){
			if(newonclickval[thing] === onclickcontents){
				return;
			}
		}
	newonclickval.push(onclickcontents);
	newonclickval = newonclickval.join(";");
	}else{
	var newonclickval = onclickcontents+";";
	}
	var newonclick = document.createAttribute("onclick");
	newonclick.value = newonclickval;
	elementtoonclick.setAttributeNode(newonclick);
}
Scene.prototype.nxtrefreshCS = function nrefreshCS(){
	window.stats.scene.finished = false;
	/*Resets the page to go to the line number set by goto (this is the same code that executes at every *page_break, *choice, etc.) */
	window.stats.scene.resetPage();
}
function refreshCS(){
	/*Let CS know we don't want to exit the scene yet */
	window.stats.scene.finished = false;
	/*Resets the page to go to the line number set by goto (this is the same code that executes at every *page_break, *choice, etc.) */
	window.stats.scene.resetPage();
}
Scene.prototype.resetALL = function resetALL(restart){
	window.wenttostats = false;
	window.nonextclick = true;
	window.timeelapsed = false;
	window.barwidth = null;
	window.orgsecx10 = null;
	if(restart === 'true'){
	window.onorgpage = true;
	window.oawenttostats = null;
	window.oatimeelapsed = null;
	window.oahideorno = null;
	window.oabgcolor = null;
	window.oatextcolor = null;
	window.oaconsequence = null;
	window.oaorgsecx10 = null;
	window.oabarwidth = null;
	}
	window.ttranonce = false;
	window.manipulate = false;
	window.timeoperator = null;
	window.restartfixed = null;
}
/*
function createTimerBar(obj){
	var choiceorotherblocks = document.getElementsByTagName('form');
	var counterel = document.createElement('p');
	var counterbg = document.createElement('div');
	obj.counterel = counterel;
	obj.counterbg = counterbg;
	Self-correcting timer bar width, calculates based on how much of the bar needs to be taken away every tenth of a second
	if(window.wenttostats === true){
		Round bar width up, barwidth is usually about a half second to a second behind
		obj.thebarwidth = Math.ceil(window.barwidth);
		Now that we've rounded up the bar width, calculate the difference based on the time still left,
		since we take off a sliver of the bar every tenth of a second, this happens 10 times the time left,
		so if time left is 18.4, times 10->184, we still have 184 times left to execute, and since the bar starts
		at the same point we left off for the stat screen we need to keep the original ratio of how much we
		chop off the bar every tenth of a second the same, thus we store the original seconds x 10 variable (secx10) 
		as a global variable in window for later access, as in now, then multiply the two, letting us know the exact width that thebarwidth
		should be at right now, and subtract thebarwidth from it, giving us the small difference between the two
		var thediff = ((window.timeelapsed*10)*(100/window.orgsecx10)) - obj.thebarwidth;
		Add the difference (even if it's a negative (incredibly unlikely, unless if perhaps you go to stat screen 10 times within a single countdown)) to thebarwidth
		obj.thebarwidth += thediff;
	}else{
		obj.thebarwidth = 100;
	}
	obj.secx10 = obj.seconds*10;
	alert(obj.seconds);
	if(window.wenttostats !== true){
	window.orgsecx10 = obj.secx10;
	}
	counterel.style.textAlign = "center";
	counterel.style.verticalAlign = "middle";
	counterel.style.margin = "0";
	counterel.style.position = "absolute";
	counterel.style.left = "0";
	counterel.style.right = "0";
	counterel.style.backgroundColor = "none";
	counterel.style.color = obj.textcolor;
	counterbg.style.width = String(obj.thebarwidth)+"%";
	counterbg.style.height = "29px";
	counterbg.style.backgroundColor = obj.bgcolor;
	counterbg.style.zIndex = "99";
	counterbg.style.marginBottom = "10px";
	if(choiceorotherblocks.length > 0){
		document.getElementById('main').insertBefore(counterbg, choiceorotherblocks[0]);
		counterbg.appendChild(counterel);
	}else{
		document.getElementById('main').insertBefore(counterbg, obj.thenextbutton);
		counterbg.appendChild(counterel);
	}
}
*/
/*End Support Functions*/

/*The actual commands*/
Scene.prototype.auto = function auto(data){
	var splitdata = data.split("|");
	if(!splitdata[0]){
		throw new Error(this.lineMsg() + "Invalid auto command, expected two args: seconds and togglehide");
    }
	this.seconds = Number(splitdata[0]);
	var seconds = this.seconds;
	if(isNaN(seconds)){
		throw new Error(this.lineMsg() + "Invalid first argument, expected a number, ex: *auto 5 or *auto five");
	}
	if(!splitdata[1]){
		throw new Error(this.lineMsg() + "Invalid auto command, expected two args: seconds and togglehide");
	}
	hideorno = String(splitdata[1]);
	/*If the togglehide argument isn't "on" and it isn't "off" either, throw a new error*/
	if(hideorno !== "on" && hideorno !== "off"){
		throw new Error(this.lineMsg() + "Invalid second argument, expected either on or off, ex: *auto 5|on or *auto five|off");
	}
	if(splitdata.length > 2){
		throw new Error(this.lineMsg() + "Invalid auto command, expected only two args: seconds and togglehide");
	}
	setTimeout(function(){
	/*Get the next button and set to variable*/
	thenextbutton = getNextButton();
	/*Dealing in milliseconds so we need to multiply accordingly*/
	trueseconds = seconds*1000;
	if(hideorno === "on"){
	/*Hide but don't completely erase the element from the page*/
		thenextbutton.style.visibility = "hidden";
	}
	/*Variable to keep track of whether the user went ahead and clicked on the next button before the timer did it for them, or clicked to the stats screen, 
	in place to make sure the timer doesn't activate on the next page unless it's called anew, no need to put in special measures for
	maintaining time on the stat screen, that's what the *countdown command is all about, this command is purely for pseudo-cinematics
	so it's no problem since while it (the timer) may need to be stopped while accessing the stats screen, it doesn't need anything else
	because the command gets called again and resets the moment the user returns from the stats screen*/
	nonextclick = true;
	nostatclick = true;
	/*Function to round to the nearest tenth of a second for display purposes*/
	function round(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
	}
	/*The following is self correcting javascript timer based on the computer's own internal clock, originally and brilliantly coded by 
	the guys over at SitePoint in this article here: http://www.sitepoint.com/creating-accurate-timers-in-javascript/ and modified to suit the purposes of this mod by yours truly (wink)*/
	var start = new Date().getTime(),
    time = 0,
    elapsed = seconds+'.0';
	function instance(){
	/*Since this is based on the setTimeout() function which only activates once and not setInterval(), 
	which goes on forever until called to stop and isn't as accurate for our purposes due to queuing, having everything 
	(including the part within the function which calls itself again) wrapped in an if/else statement based on 
	if there's still time remaining stops the function from calling itself over again and ends the countdown loop*/
		if(nonextclick === true){
			if(nostatclick === true){
				if(elapsed <= 0){
					refreshCS();
					resetButton(thestatbutton, "nostatclick = false");
				}else{
					time += 100;
					elapsed = round(seconds - Math.floor(time / 100) / 10, 10);
					if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
					var diff = (new Date().getTime() - start) - time;
					window.setTimeout(instance, (100 - diff));
				}
			}
		}else if(nonextclick === false){
			refreshCS();
			resetButton(thestatbutton, "nostatclick = false");
		}
	};
	therestartbutton = document.getElementById("restartButton");
	setOnclicks(therestartbutton, "window.stats.scene.resetALL('true')");
	/*Add new onclick attribute to the next button whenever command is called */
	setOnclicks(thenextbutton, "nonextclick = false");
	thestatbutton = document.getElementById("statsButton");
	/*Add new onclick attribute to the stat button whenever command is called */
	setOnclicks(thestatbutton, "nostatclick = false");
	window.setTimeout(instance, 100);
	},25);
}

Scene.prototype.countdown = function countdown(data){
	/*Split the data string into an array key=>value pair every '|' encountered*/
	var splitdata = data.split("|");
	if(!splitdata[0]){
		throw new Error(this.lineMsg() + "Invalid countdown command, expected at least four args: seconds togglehide bgcolor textcolor");
    }
	/*If the user went to the stats in the middle of the countdown 
	(checked by the statscreencheck property added to the scene object via the mod) 
	then set the timer to exactly the time it was when they left, if not, continue like normal*/
	if(window.wenttostats === true){
	this.seconds = window.timeelapsed;
	}else{
	this.seconds = Number(splitdata[0]);
	}
	var seconds = this.seconds;
	if(isNaN(seconds)){
		throw new Error (this.lineMsg() + "Invalid first argument, expected a number, ex: *countdown 5");
	}
	if(!splitdata[1]){
		throw new Error(this.lineMsg() + "Invalid countdown command, expected at least four args: seconds togglehide bgcolor textcolor");
	}
	this.hideorno = String(splitdata[1]);
	var hideorno = this.hideorno;
	if(hideorno !== "on" && hideorno !== "off"){
		throw new Error(this.lineMsg() + "Invalid second argument, expected either 'on' or 'off', ex: *countdown 5|on or *countdown 5|off");
	}
	if(!splitdata[2]){
		throw new Error(this.lineMsg() + "Invalid countdown command, expected at least four args: seconds togglehide bgcolor textcolor");
	}
	this.bgcolor = String(splitdata[2]);
	var bgcolor = this.bgcolor;
	/*Test the bgcolor parameter for only the letters A thru F and the numbers 0-9 and allow 
	up to six characters (full hexcolor code) or three characters (shorthand hexcolor code)*/
	if(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(bgcolor) === false){
		throw new Error(this.lineMsg() + "Invalid third argument, expected a proper hexcolor code, ex: *countdown 5|on|#ff0000 or *countdown 5|on|#f00");
	}
	if(!splitdata[3]){
		throw new Error(this.lineMsg() + "Invalid countdown command, expected at least four args: seconds togglehide bgcolor textcolor");
	}
	/*Test the textcolor paramter the same way as the bgcolor parameter*/
	this.textcolor = String(splitdata[3]);
	var textcolor = this.textcolor;
	if(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(textcolor) === false){
		throw new Error(this.lineMsg() + "Invalid fourth argument, expected a proper hexcolor code, ex: *countdown 5|on|#ff0000|#f00 or *countdown 5|on|#f00|#ff0000");
	}
	if(splitdata[4]){
			this.consequence = String(splitdata[4]);
			var consequence = this.consequence;
			if(splitdata.length[5]){
			throw new Error(this.lineMsg() + "Invalid countdown command, countdown has a maximum of only five arguments: seconds togglehide bgcolor textcolor consequence");
		}
	}
	setTimeout(function(){
	thenextbutton = getNextButton();
	trueseconds = seconds*1000;
	if(hideorno === "on"){
		thenextbutton.style.visibility = "hidden";
	}
	this.thebarwidth;
	var thebarwidth = this.thebarwidth;
	var choiceorotherblocks = document.getElementsByTagName('form');
	var counterel = document.createElement('p');
	var counterbg = document.createElement('div');
	/*Self-correcting timer bar width, calculates based on how much of the bar needs to be taken away every tenth of a second */
	if(window.wenttostats === true){
		/*Round bar width up, barwidth is usually about a half second to a second behind */
		thebarwidth = Math.ceil(window.barwidth);
		/*Now that we've rounded up the bar width, calculate the difference based on the time still left,
		since we take off a sliver of the bar every tenth of a second, this happens 10 times the time left,
		so if time left is 18.4, times 10->184, we still have 184 times left to execute, and since the bar starts
		at the same point we left off for the stat screen we need to keep the original ratio of how much we
		chop off the bar every tenth of a second the same, thus we store the original seconds x 10 variable (secx10) 
		as a global variable in window for later access, as in now, then multiply the two, letting us know the exact width that thebarwidth
		should be at right now, and subtract thebarwidth from it, giving us the small difference between the two */
		var thediff = ((window.timeelapsed*10)*(100/window.orgsecx10)) - thebarwidth;
		/*Add the difference (even if it's a negative (incredibly unlikely, unless if perhaps you go to stat screen 10 times within a single countdown)) to thebarwidth */
		thebarwidth += thediff;
	}else{
		thebarwidth = 100;
	}
	var secx10 = seconds*10;
	if(window.wenttostats !== true){
	window.orgsecx10 = secx10;
	}
	counterel.style.textAlign = "center";
	counterel.style.verticalAlign = "middle";
	counterel.style.margin = "0";
	counterel.style.position = "absolute";
	counterel.style.left = "0";
	counterel.style.right = "0";
	counterel.style.backgroundColor = "none";
	counterel.style.color = textcolor;
	counterbg.style.width = String(thebarwidth)+"%";
	counterbg.style.height = "29px";
	counterbg.style.backgroundColor = bgcolor;
	counterbg.style.zIndex = "99";
	counterbg.style.marginBottom = "10px";
	if(choiceorotherblocks.length > 0){
		document.getElementById('main').insertBefore(counterbg, choiceorotherblocks[0]);
		counterbg.appendChild(counterel);
	}else{
		document.getElementById('main').insertBefore(counterbg, thenextbutton);
		counterbg.appendChild(counterel);
	}
	function round(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
	}
	var start = new Date().getTime();
    var time = 0;
	/*Minor nitpick for prettyness, when the countdown first starts, 
	the number of seconds that we use for the counter is just a plain ol' number, like 5,
	that's why we add the ".0" to it, to show that 10ths of a second will be displayed,
	however when we come back from the stats menu in the middle of a countdown, it's already in the right format,
	for example: 4.6, adding ".0" to the end of it so it looks like this: 4.6.0 is just pointless and
	not seamless. */
	if(window.wenttostats === true){
	var elapsed = seconds;
	}else{
	var elapsed = seconds+'.0';
	}
	/*Store important information as global variables in window so we can access them easier later. */
	/*Reset the stats to defaults every time the countdown property is called,
	by doing this (and particularly so late in the function), even when a person 
	comes back from the stats screen, the function will run like normal, only with less time,
	this allows for multiple trips to the statscreen and back, without killing the mathematics
	behind the setTimeouts, since it runs like a brand new countdown command. It took me 4 hours of 
	struggling with the setTimeout's to get it to run through the time correctly (and not superfast)
	on the return before I realized it would be immeasurably simpler to run it anew, 
	exactly from the time the user left for the stats screen... 
	The Way Of Less BS in action folks... The Way Of Less BS... I need ta' copyright that. */
	window.wenttostats = false;
	/*Variable that tells whether the user clicked on the next button or not.
	Needs to be separate from cdwenttostats due to how (for maximum browser compatibility) 
	the next button and stats button are handled with onclicks via depreciated createAttribute and setAttributeNode. */
	window.nonextclick = true;
	function instance(){
	counterel.innerHTML = elapsed;
	thebarwidth -= 100/window.orgsecx10;
	window.barwidth = thebarwidth;
	counterbg.style.width = String(thebarwidth)+'%';
		if(window.nonextclick === true){
			if(window.wenttostats === false){
			if(elapsed <= 0){
				/*Goto sets the line number to the corresponding label if a label is provided*/
				if(splitdata[4]){
				window.stats.scene.goto(consequence);
				}
				thenextbutton.click();
				/*Reset stat button to original defaults */
				resetButton(thestatbutton, "window.stats.scene.statscreencheck()");
				/*Resets the timeelapsed variable to default */
				window.timeelapsed = false;
			}else{
				time += 100;
				elapsed = round(seconds - Math.floor(time / 100) / 10, 10);
				if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
				var diff = (new Date().getTime() - start) - time;
				/*Record time left to global variable for easy access. */
				window.timeelapsed = elapsed;
				window.setTimeout(instance, (100 - diff));
			}
			}
		}else if(window.nonextclick === false){
			resetButton(thestatbutton, "window.stats.scene.statscreencheck()");
		}
	};
	window.setTimeout(instance, 100);
	therestartbutton = document.getElementById("restartButton");
	setOnclicks(therestartbutton, "window.stats.scene.resetALL('true')");
	/*Add new onclick attribute to the next button whenever command is called */
	setOnclicks(thenextbutton, "nonextclick = false");
	setOnclicks(thenextbutton, "window.stats.scene.resetALL()");
	setOnclicks(thenextbutton, "window.stats.scene.finished = false");
	setOnclicks(thenextbutton, "window.stats.scene.resetPage()");
	thestatbutton = document.getElementById("statsButton");
	/*Same for stat button */
	setOnclicks(thestatbutton, "window.stats.scene.statscreencheck()");
	},25);
}

Scene.prototype.overarch = function overarch(data){
	window.onorgpage;
	if(window.onorgpage !== false){
		window.onorgpage = true;
	}
	var splitdata = data.split("|");
	if(!splitdata[0]){
		throw new Error(this.lineMsg() + "Invalid countdown command, expected at least four args: seconds togglehide bgcolor textcolor");
    }
	if(window.wenttostats === true){
	this.seconds = window.oatimeelapsed;
	}else{
	this.seconds = Number(splitdata[0]);
	}
	var seconds = this.seconds;
	if(isNaN(seconds)){
		throw new Error (this.lineMsg() + "Invalid first argument, expected a number, ex: *countdown 5");
	}
	if(!splitdata[1]){
		throw new Error(this.lineMsg() + "Invalid countdown command, expected at least four args: seconds togglehide bgcolor textcolor");
	}
	hideorno = String(splitdata[1]);
	if(hideorno !== "on" && hideorno !== "off"){
		throw new Error(this.lineMsg() + "Invalid second argument, expected either 'on' or 'off', ex: *countdown 5|on or *countdown 5|off");
	}
	if(!splitdata[2]){
		throw new Error(this.lineMsg() + "Invalid countdown command, expected at least four args: seconds togglehide bgcolor textcolor");
	}
	bgcolor = String(splitdata[2]);
	if(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(bgcolor) === false){
		throw new Error(this.lineMsg() + "Invalid third argument, expected a proper hexcolor code, ex: *countdown 5|on|#ff0000 or *countdown 5|on|#f00");
	}
	if(!splitdata[3]){
		throw new Error(this.lineMsg() + "Invalid countdown command, expected at least four args: seconds togglehide bgcolor textcolor");
	}
	textcolor = String(splitdata[3]);
	if(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(textcolor) === false){
		throw new Error(this.lineMsg() + "Invalid fourth argument, expected a proper hexcolor code, ex: *countdown 5|on|#ff0000|#f00 or *countdown 5|on|#f00|#ff0000");
	}
	if(splitdata[4]){
		consequence = String(splitdata[4]);
		if(splitdata.length > 5){
		throw new Error(this.lineMsg() + "Invalid countdown command, countdown has a maximum of only five arguments: seconds togglehide bgcolor textcolor consequence");
		}
	}
	window.oahideorno = hideorno;
	window.oabgcolor = bgcolor;
	window.oatextcolor = textcolor;
	if(splitdata[4]){
		window.oaconsequence = consequence;
	}
	setTimeout(function(){
		function recalculatebw(){
			thebarwidth = Math.ceil(window.oabarwidth);
			var thediff = ((window.oatimeelapsed*10)*(100/window.oaorgsecx10)) - thebarwidth;
			thebarwidth += thediff;
			if(thebarwidth > 100){
				thebarwidth = 100;
				window.oaorgsecx10 = seconds*10;
			}
		}
	var buttonsonpage = document.getElementsByTagName('button');
	var nxtnum = buttonsonpage.length -1;
	var thenextbutton = buttonsonpage[nxtnum];
	var trueseconds = seconds*1000;
	if(hideorno === "on"){
		thenextbutton.style.visibility = "hidden";
	}
	var bodytag = document.getElementsByTagName('body')[0];
	var choiceorotherblocks = document.getElementsByTagName('form');
	var counterel = document.createElement('p');
	var counterbg = document.createElement('div');
	var thebarwidth;
	if(window.wenttostats === true){
		recalculatebw();
	}else{
		thebarwidth = 100;
	}
	var secx10 = seconds*10;
	if(window.wenttostats !== true){
	window.oaorgsecx10 = secx10;
	}
	counterel.style.textAlign = "center";
	counterel.style.verticalAlign = "middle";
	counterel.style.margin = "0";
	counterel.style.position = "absolute";
	counterel.style.left = "0";
	counterel.style.right = "0";
	counterel.style.backgroundColor = "none";
	counterel.style.color = textcolor;
	counterbg.style.width = String(thebarwidth)+"%";
	counterbg.style.height = "29px";
	counterbg.style.backgroundColor = bgcolor;
	counterbg.style.zIndex = "99";
	counterbg.style.marginBottom = "10px";
	counterbg.id = "overarchcountdown";
	/*Remove older timers so as not to create duplicates */
	if(document.getElementById("overarchcountdown")){
	bodytag.removeChild(document.getElementById("overarchcountdown"));
	}
	/*Create the node outside the area that CS constantly refreshes, i.e. the "main" div*/
	bodytag.insertBefore(counterbg, document.getElementById('main'));
	counterbg.appendChild(counterel);
	function round(num, places) {
    var multiplier = Math.pow(10, places);
    return Math.round(num * multiplier) / multiplier;
	}
	var start = new Date().getTime();
    var time = 0;
	if(window.wenttostats === true){
	var elapsed = seconds;
	}else{
	var elapsed = seconds+'.0';
	}
	window.wenttostats = false;
	window.oanoclear = true;
	var ranonce;
	function instance(){
	if(ranonce){
	recalculatebw();
	}
	counterel.innerHTML = elapsed;
	thebarwidth -= 100/window.oaorgsecx10;
	window.oabarwidth = thebarwidth;
	counterbg.style.width = thebarwidth.toString()+'%';
	if(window.oanoclear === true){
			if(window.wenttostats !== true){
			if(elapsed <= 0){
				bodytag.removeChild(document.getElementById("overarchcountdown"));
				if(splitdata[4]){
				window.stats.scene.goto(consequence);
				}
				refreshCS();
				resetButton(thestatbutton, "window.stats.scene.oastatscreencheck()");
				window.stats.scene.resetALL();
			}else{
				time += 100;
				if(window.ttranonce !== true){
					if(window.manipulate === true){
						if(window.timeoperator === "+"){
							seconds += window.timemodifier;
						}
						if(window.timeoperator === "-"){
							seconds -= window.timemodifier;
						}
						if(window.timeoperator === "*"){
							seconds *= window.timemodifier;
						}
						if(window.timeoperator === "/"){
							seconds /= window.timemodifier;
						}
					window.manipulate = false;
					window.ttranonce = true;
					}
				}
				elapsed = round(seconds - Math.floor(time / 100) / 10, 10);
				if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
				var diff = (new Date().getTime() - start) - time;
				/*Record time left to a stat for easy access. */
				window.oatimeelapsed = elapsed;
				elapsed = window.oatimeelapsed;
				if(!ranonce){
					ranonce = true;
				}
				window.setTimeout(instance, (100 - diff));
			}
			}
	}else if(window.oanoclear === false){
			bodytag.removeChild(document.getElementById("overarchcountdown"));
			window.stats.scene.resetALL();
	}
};
	window.setTimeout(instance, 100);
	therestartbutton = document.getElementById("restartButton");
	setOnclicks(therestartbutton, "window.stats.scene.resetALL('true')");
	setOnclicks(thenextbutton, "window.onorgpage = false");
	setOnclicks(thenextbutton, "window.stats.scene.finished = false");
	setOnclicks(thenextbutton, "window.stats.scene.resetPage()");
	thestatbutton = document.getElementById("statsButton");
	setOnclicks(thestatbutton, "window.stats.scene.oastatscreencheck()");
	},25);
}
Scene.prototype.statscreencheck = function statscreencheck(){
	if(window.stats.scene.name == "choicescript_stats"){
		window.wenttostats = true;
	}
}
Scene.prototype.oastatscreencheck = function oastatscreencheck(){
	if(window.stats.scene.name == "choicescript_stats"){
		window.wenttostats = true;
		thestatbutton = document.getElementById("statsButton");
		if(window.onorgpage === false){
		setOnclicks(thestatbutton, "window.stats.scene.re("+window.oatimeelapsed+")");
		}
	}
}
Scene.prototype.re = function re(time){
	if(window.stats.oaconsequence){
		window.stats.scene.overarch(time+"|"+window.oahideorno+"|"+window.oabgcolor+"|"+window.oatextcolor+"|"+window.oaconsequence);
	}else{
		window.stats.scene.overarch(time+"|"+window.oahideorno+"|"+window.oabgcolor+"|"+window.oatextcolor);
	}
	resetButton(thestatbutton, "window.stats.scene.re("+time+")");
};
Scene.prototype.cleartimer = function cleartimer(){
	setTimeout(function(){window.oanoclear = false;},100);
}
Scene.prototype.resetTT = function resetTT(){
	if(window.ttranonce = true){
		window.ttranonce = false;
		window.manipulate = false;
	}
}
Scene.prototype.timetransmodify = function timetransmodify(data){
	window.manipulate = true;
	window.ttranonce;
	splitdata = data.split("|");
	window.timeoperator = String(splitdata[0]);
	window.timemodifier = Number(splitdata[1]);
	window.setTimeout(function(){
	var buttonsonpage = document.getElementsByTagName('button');
	var nxtnum = buttonsonpage.length -1;
	var thenextbutton = buttonsonpage[nxtnum];
	nxtattr = document.createAttribute("onclick");
	nxtattr.value = "window.stats.scene.finished = false;window.stats.scene.resetPage();window.stats.scene.resetTT();";
	thenextbutton.setAttributeNode(nxtattr);
	},100);
}