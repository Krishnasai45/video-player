import React from 'react';

const  PlayListCard =({ video,handleVideoClick,videoId })=> {
    return (
        <div className='card'>
            <div className={`image ${videoId == video.id ? 'playing' : '' }`}onClick={()=>handleVideoClick(video)}>
                <img src={video?.thumb} alt={`${video.title} img`} />
            </div>
            <div className="details">
                <h6>{video.title}</h6>
                <p >
                    {video.description.length > 100
                        ? video.description.slice(0, 100) + "..."
                        : video.description}
                </p>
            </div></div>
    );
}

export default PlayListCard;


