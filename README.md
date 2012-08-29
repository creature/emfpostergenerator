The Electromagnetic Field Poster Generator
==========================================

The EMF Poster Generator is a simple Sinatra & JavaScript app that lets attendees at [EMF](http://emfcamp.org/) easily create a poster about their projects. It lets users edit the poster in place and save it as a publicly accessible web page. 

It doesn't degrade gracefully and it won't work without JavaScript. It makes use of [960.gs](http://960.gs/) and [PageDown](http://code.google.com/p/pagedown/).


Requirements
------------

Ruby; Sinatra; SQLite; SASS; DataMapper.


Getting Started
---------------

1. Get a copy of the source code. 
2. Generate the required CSS files: 
       cd public/css; sass blueonwhite.scss blueonwhite.css; sass blackonwhite.scss blackonwhite.css; sass whiteonblue.scss whiteonblue.css
3. Run posters.rb: 
       ruby posters.rb

You'll now have a server running on http://localhost:4567. Visiting that URL in your web browser should show you the poster generator.


System Tour
-----------

### posters.rb

The backend server for the system. Pretty straightforward. The top bit defines the model for our poster. The bottom bit has three routes set up: one to serve the index page (the dummy poster), one to serve a specific poster (pretty much the same), and one to save a new poster.


### views/index.erb

The only template in the system. It's the poster. 


### public/js/postereditor.js 

The JavaScript that drives the front-end. Registers some click handlers for the editable elements, and saves the poster via AJAX. 


License
-------

GPL v2, except for the bits that aren't (960gs and PageDown).


Credits
-------

The code was written by [Alex Pounds](http://alexpounds.com/). Visual design by [Roberto Crippa](http://robertocrippa.com/).
