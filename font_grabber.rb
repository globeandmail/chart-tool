#!/usr/bin/ruby
# encoding: utf-8
# Grab google web fonts and embed them as base64 data URIs
# <http://brettterpstra.com/2015/03/14/embedding-google-web-fonts/>
# run it like: ruby font_grabber.rb "<link href='https://fonts.googleapis.com/css?family=Lato:400&subset=latin' rel='stylesheet' type='text/css'>" > lato_code.css
require 'base64'

if ARGV.length > 0
  input = ARGV
elsif STDIN.stat.size > 0
  input = STDIN.read.strip.split(/\n+/)
else
  $stderr.puts "No input"
  Process.exit 1
end

output = ""

input.each {|line|
  if line =~ /^\s*<link.*?>\s*$/
    url = line.match(/href='(.*?)'/)
    if url
      css_url = url[1]
    else
      $stderr.puts "Error matching url"
    end

    css = %x{curl -sS '#{css_url}'}.strip

    css.gsub!(/(src: .*?, url\()(.*?)(\) format\(')(.*?)('\);)/).each {|src|
      pre = $1
      font_url = $2
      mid = $3
      font_fmt = $4
      post = $5
      font_ext = font_url.match(/\.(\w+)$/)[1]
      font_src = %x{curl -sS '#{font_url}'}
      enc = Base64.encode64(font_src).strip.gsub(/\n/,'')
      %Q{src:url("data:font/#{font_ext};base64,#{enc}") format('#{font_fmt}');}
    }
    output += css + "\n"
  else
    next
  end
}

$stdout.puts output
