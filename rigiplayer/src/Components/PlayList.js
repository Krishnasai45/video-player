import React, { useEffect } from 'react';
import PlayListCard from './PlayListCard';
import '../Styles/Playlist.css';

const Playlist=({ videos, onSelectVideo,handleVideoClick,currentVideoId })=> {
    const handleDragStart = (e, index) => {
      e.dataTransfer.setData('index', index);
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const handleDrop = (e, targetIndex) => {
      const sourceIndex = parseInt(e.dataTransfer.getData('index'));
      onSelectVideo(sourceIndex, targetIndex);
    };


    useEffect(() => {
        const savedPlaylistOrder = sessionStorage.getItem('playlistOrder');
        if (savedPlaylistOrder) {
          const reorderedPlaylist = savedPlaylistOrder.split(',').map((index) => videos[parseInt(index)]);
          onSelectVideo(0, 0);
        }
      }, []);
  
    return (
      <div className='play-list'>
        <h3 className='list-title'>PlayList</h3>
        {videos.map((video, index) => (
          <div
            key={video.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <PlayListCard video={video} handleVideoClick={handleVideoClick} videoId={currentVideoId} />
          </div>
        ))}
      </div>
    );
  }

  export default  Playlist
  