#!`which ruby` -rubygems
require 'bundler/setup'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'data_mapper'
require 'cgi'
require 'uri'
require 'sanitize'
require 'kramdown'

DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, 'sqlite:posters.sqlite')

class Poster
  include DataMapper::Resource

  CSS_FILES = Dir.glob('public/css/*.css').map {|f| File.basename f }

  property :id, Serial
  property :title, Text
  property :image_url, Text
  property :body, Text
  property :footer, Text
  property :stylesheet, String
  property :created_at, DateTime
  property :ip, String

  validates_within :stylesheet, :set => CSS_FILES

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
  @poster = Poster.new(:title => CGI::escapeHTML(params[:title]),
                       :image_url => URI.escape(params['image_url']),
                       :body => params['body'],
                       :footer => CGI::escapeHTML(params['footer']),
                       :stylesheet => File.basename(params['stylesheet']),
                       :created_at => Time.now,
                       :ip => request.ip)
  if @poster.save
    @poster.id.to_s
  else
    422 # Return HTTP 422, Unprocessable Entity
  end
end
