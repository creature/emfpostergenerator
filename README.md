The Electromagnetic Field Poster Generator
==========================================

The EMF Poster Generator is a simple Sinatra & JavaScript app built for attendees at [EMF 2012](http://emfcamp.org/). The aim was to easily create a poster about their on-site projects. Users can edit the poster in place and save it as a publicly accessible web page. 

It doesn't degrade gracefully and it won't work without JavaScript. It makes use of [960.gs](http://960.gs/) and [PageDown](http://code.google.com/p/pagedown/).

A `config.ru` file is provided, so it should run out-of-the-box as a [Rack](http://rack.github.io/) app. You can try it out [on the web](http://demo.ethicsgirls.com/).


Requirements
------------

Ruby; Sinatra; SQLite; SASS; DataMapper.


Getting Started
---------------

1. Get a copy of the source code. 
    ```
    git clone git@github.com:creature/emfpostergenerator.git
    cd emfpostergenerator
    ```
1. Grab the dependencies.
    ```
    bundle install
    ```
1. Generate the CSS files:
    ```
    cd public/css
    sass blueonwhite.scss blueonwhite.css
    sass blackonwhite.scss blackonwhite.css
    sass whiteonblue.scss whiteonblue.css
    ```
1. Run `poster.rb`:
    ```
    ruby poster.rb
    ```

You'll now have a server running on [http://localhost:4567](http://localhost:4567). Visiting that URL in your web browser should show you the poster generator.


System Tour
-----------

### poster.rb

The backend server for the system. The top section defines the model for our poster. The bottom section has three routes set up: one to serve the index page (the dummy poster), one to serve a specific poster (pretty much the same), and one to save a new poster.


### views/index.erb

The only template in the system. It's the poster. 


### public/js/postereditor.js 

The JavaScript that drives the front-end. Registers some click handlers for the editable elements, and saves the poster via AJAX. 


License
-------

AGPL, except for the bits that aren't (960gs and PageDown).


Credits
-------

The code was written by [Alex Pounds](http://alexpounds.com/). Visual design by [Roberto Crippa](http://robertocrippa.com/).
