ENV['GEM_HOME'] ||= `gem env path`.strip.split(':').first
ENV['GEM_PATH'] ||= `gem env path`.strip
Gem.clear_paths
require "rubygems"
require "sinatra"
require "poster"

run Sinatra::Application
