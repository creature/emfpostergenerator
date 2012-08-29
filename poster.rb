#!`which ruby` -rubygems
require 'bundler/setup'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'data_mapper' 
require 'sanitize'
require 'kramdown' 

DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, 'sqlite:posters.sqlite')

class Poster
  include DataMapper::Resource

  property :id, Serial
  property :title, Text
  property :image_url, Text
  property :body, Text
  property :footer, Text
  property :stylesheet, Integer
  property :created_at, DateTime
  property :ip, String

  def body
    text = self[:body] || ""
    Sanitize.clean(Kramdown::Document.new(text).to_html, Sanitize::Config::RELAXED)
  end

  def get_markdown
    self[:body]
  end
end

DataMapper.finalize
DataMapper.auto_upgrade!


get '/' do
  @poster = Poster.new()
  erb :index
end

get '/:id' do
  @poster = Poster.get(params[:id])
  if @poster
    erb :index
  else
    redirect '/'
  end
end

post '/save' do
  @poster = Poster.new(:title => params[:title], 
                       :image_url => params['image_url'], 
                       :body => params['body'], 
                       :footer => params['footer'], 
                       :created_at => Time.now, 
                       :ip => request.ip)
  if @poster.save
    @poster.id.to_s
  else
    "fail"
  end
end
