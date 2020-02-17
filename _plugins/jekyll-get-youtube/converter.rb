require "jekyll"
require 'json'
require 'open-uri'

module JekyllGetYoutube
  class GetYoutubeGenerator < Jekyll::Generator
    safe true
    priority :highest

    def generate(site)
  
      yt_api = ENV['YT_API']
      yt_playlist = ENV['YT_PLAYLIST']

      if !yt_api
        warn "No api key".red
        return
      end
  
      if !yt_playlist
        warn "No playlist".red
        return
      end

      target = site.data['youtube']
      source = JSON.load(open("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=#{yt_playlist}&key=#{yt_api}"))
      
      site.data['youtube'] = source
    end
  end
end

