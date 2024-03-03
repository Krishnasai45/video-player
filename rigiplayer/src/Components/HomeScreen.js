import React, { useState,useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import Playlist from './PlayList';
import mediaJSON from '../VideoData';
import '../App.css'

const HomeScreen=()=> {
    const initialPlayList = mediaJSON?.categories[0]?.videos || []
    const [playlist, setPlaylist] = useState(() => {
        const storedPlaylist = sessionStorage.getItem('playlist');
        return storedPlaylist ? JSON.parse(storedPlaylist) : initialPlayList
      });
    const [currentVideoId,setCurrentVideoId] = useState(playlist[0].id)
    const [currentVideo,setCurrentVideo] = useState(playlist[0])

    useEffect(() => {
        sessionStorage.setItem('playlist', JSON.stringify(playlist));
      }, [playlist]);

  
    const handleVideoClick = (video) => {
        setCurrentVideo(video)
      setCurrentVideoId(video.id)
    };
  
    const handleSelectVideo = (sourceIndex, targetIndex) => {
        const reorderedPlaylist = [...playlist];
        const [removed] = reorderedPlaylist.splice(sourceIndex, 1);
        reorderedPlaylist.splice(targetIndex, 0, removed);
        setPlaylist(reorderedPlaylist);
        sessionStorage.setItem('playlistOrder', reorderedPlaylist.map((_, index) => index).join(','));
      };
  
    return (
      <div className='main-page'>
        <VideoPlayer
          video={currentVideo}
          playlist={playlist} currentVideoId={currentVideoId} handleVideoChange={handleVideoClick}
        />
        <Playlist videos={playlist} onSelectVideo={handleSelectVideo} handleVideoClick={handleVideoClick} currentVideoId={currentVideoId} />
      </div>
    );
  }
  
  export default HomeScreen;