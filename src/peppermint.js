/*
PeppermintReader
Copyright (C) 2016 Justin Overton

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var peppermintReader = peppermintReader || {};

(function(pr){
    
    pr.help = function(phrase){
        console.log(phrase);
        alert('User needs help with "' + phrase + '"');
    };
    
    var commands = {
        // annyang will capture anything after a splat (*) and pass it to the function.
        // e.g. saying "Show me Batman and Robin" will call showFlickr('Batman and Robin');
        'pepper help *me': pr.help
    };
    
    // Add our commands to annyang
    annyang.addCommands(commands);

    // Tell KITT to use annyang
    SpeechKITT.annyang();

    // Define a stylesheet for KITT to use
    SpeechKITT.setStylesheet('lib/speechKitt/themes/flat.css');

    // Render KITT's interface
    SpeechKITT.vroom();
    
    annyang.start({ autoRestart: true, continuous: true });
    
    annyang.addCallback('error', function() {
        console.log({error: arguments});
    });
    
    annyang.addCallback('errorNetwork', function() {
        console.log({errorNetwork: arguments});
    });
    
    annyang.addCallback('errorPermissionBlocked', function() {
        console.log({errorPermissionBlocked: arguments});
    });
    
    annyang.addCallback('errorPermissionDenied', function() {
        console.log({errorPermissionDenied: arguments});
    });
    
    annyang.addCallback('resultMatch', function() {
        console.log({resultMatch: arguments});
    });
    
    annyang.addCallback('resultNoMatch', function() {
        console.log({resultNoMatch: arguments});
    });
})(peppermintReader);


