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
goog.provide('peppermintReader.model');

peppermintReader.model.profileStub = function() {
    this._t = 'peppermintReader.model.profileStub';
    this.name = '';
    this.avatar = '';
};

peppermintReader.model.profile = function() {
    this._t = 'peppermintReader.model.profile';
    this.name = '';
    this.words = {}; //wordProfeciencies
    this.storiesRead = [];
};

peppermintReader.model.wordProfeciency = function() {
    this._t = 'peppermintReader.model.wordProfeciency';
    this.word = '';
    this.lastUpdated = 0;
    this.phonicStats = new peppermintReader.model.stat();
    this.sightStats = new peppermintReader.model.stat();
    this.pictureStats = new peppermintReader.model.stat();
    this.storyStats = new peppermintReader.model.stat();
};

peppermintReader.model.stat = function() {
    this._t = 'peppermintReader.model.stat';
    this.seen = 0;
    this.correct = 0;
};

peppermintReader.model.stat.prototype.getAccuracy = function() {

    if(this.seen === 0)
        return 0;

    return this.correct / this.seen;
};

peppermintReader.model.stat.prototype.increment = function(isCorrect) {
    this.seen++;
    if(isCorrect) {
        this.correct++;
    }
};

peppermintReader.model.page = function() {
    this._t = 'peppermintReader.model.page';
    this.illustrations = [
        //TODO
        /* zorder, visible, name */
    ];
    
    //words of the story (eventually complex objects that reveal illustrations as they are read)
    this.words = [];
};

peppermintReader.model.word = function() {
    this._t = 'peppermintReader.model.word';
    this.word = '';
    this.audio = ''; //base64, ref to file, what?
    this.phonetic = []; //Phonetic representation of the word that can be used during sounding it out
    this.image = '';
};

peppermintReader.model.word.prototype.isHomophone = function(other) {
  
  if(this.word === other.word) {
    return true;
  }
  
  for(var i=0; i<this.phonetic.length; i++) {
    var a = this.phonetic[i];
    for(var k=0; k<other.phonetic.length; k++) {
      var b = other.phonetic[i];
      if(a == b) {
        return true;
      }
    }
  }
  
  return false;
};

peppermintReader.model.story = function() {
    this._t = 'peppermintReader.model.story';
    this.pages = [];
    this.wordSet = []; //distinct set of words within pages
    this.author = '';
    this.coverImage = '';
    this.title = '';
    this.id = '';
};
