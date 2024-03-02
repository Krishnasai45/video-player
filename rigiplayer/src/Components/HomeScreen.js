import React, { useState,useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import Playlist from './PlayList';
import mediaJSON from '../VideoData';

function HomeScreen() {
    const initialPlayList = mediaJSON?.categories[0]?.videos || []
    const [playlist, setPlaylist] = useState(() => {
        const storedPlaylist = sessionStorage.getItem('playlist');
        return storedPlaylist ? JSON.parse(storedPlaylist) : initialPlayList
      });
    const [selectedVideo, setSelectedVideo] = useState(playlist[0].sources);
    const [currentVideoId,setCurrentVideoId] = useState(playlist[0].id)
    const [currentVideo,setCurrentVideo] = useState(playlist[0])

    useEffect(() => {
        sessionStorage.setItem('playlist', JSON.stringify(playlist));
      }, [playlist]);

  
    const handleVideoClick = (video) => {
        setCurrentVideo(video)
      setSelectedVideo(video.source);
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
      <div className='main-page' style={{display:'flex',width:'100%',flexWrap:'wrap', gap: '1rem'}}>
        <VideoPlayer
          video={currentVideo}
          autoplay={true}
          playbackSpeed={1}
        />
        <Playlist videos={playlist} onSelectVideo={handleSelectVideo} handleVideoClick={handleVideoClick} currentVideoId={currentVideoId} />
      </div>
    );
  }
  
  export default HomeScreen;