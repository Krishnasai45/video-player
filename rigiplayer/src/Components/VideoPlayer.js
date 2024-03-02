import React, { useRef, useState, useEffect } from 'react';
import '../Styles/Player.css'

const  VideoPlayer = ({ video })=>{
    const src = video?.sources
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const controlsRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [autoPlay, setAutoPlay] = useState(false);
    const [isFillScreen, setIsFullScreen] = useState(false)
    const [isSeeking, setIsSeeking] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        const storedTime = localStorage.getItem(`videoTime_${src}`);
        if (storedTime) {
            video.currentTime = parseFloat(storedTime);
            setCurrentTime(parseFloat(storedTime));
        }

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            localStorage.setItem(`videoTime_${src}`, video.currentTime.toString());
        };
        const handleDurationChange = () => setDuration(video.duration);
        const handlePlayPause = () => setIsPlaying(!video.paused);
        const handleVideoEnded = () => {
            video.currentTime = 0;
            setCurrentTime(0);
            setIsPlaying(false);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('durationchange', handleDurationChange);
        video.addEventListener('play', handlePlayPause);
        video.addEventListener('pause', handlePlayPause);
        video.addEventListener('ended', handleVideoEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('durationchange', handleDurationChange);
            video.removeEventListener('play', handlePlayPause);
            video.removeEventListener('pause', handlePlayPause);
            video.removeEventListener('ended', handleVideoEnded);
        };
    }, [src]);

    useEffect(() => {
        const video = videoRef.current;
        video.volume = volume;
        video.playbackRate = playbackSpeed;
        video.autoplay = autoPlay;
    }, [volume, playbackSpeed, autoPlay]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case ' ':
                    togglePlayPause();
                    break;
                case 'ArrowUp':
                    increaseVolume();
                    break;
                case 'ArrowDown':
                    decreaseVolume();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    forwardSeek();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    backwardSeek();
                    break;
                case 'f':
                    toggleFullScreen();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [volume, playbackSpeed, autoPlay, currentTime]);


    useEffect(() => {
        const player = playerRef.current;
        const controls = controlsRef.current;

        let timeout;

        player.addEventListener('mousemove', () => {
            controls.style.display = 'inline-block';
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                controls.style.display = 'none';
            }, 3000);
        });

        return () => {
            player.removeEventListener('mousemove', null);
            clearTimeout(timeout);
        };
    }, []);


    useEffect(() => {
        const handleSeeking = () => {
            setIsSeeking(true);
        };

        const handleSeeked = () => {
            setIsSeeking(false);
            setCurrentTime(videoRef.current.currentTime);
        };

        videoRef.current.addEventListener('seeking', handleSeeking);
        videoRef.current.addEventListener('seeked', handleSeeked);

        return () => {
            videoRef.current.removeEventListener('seeking', handleSeeking);
            videoRef.current.removeEventListener('seeked', handleSeeked);
        };
    }, []);

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
        setIsPlaying(!video.paused);
    };

    const handleVolumeChange = (e) => {
        const volume = parseFloat(e.target.value);
        setVolume(volume);
        setIsMuted(false);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (video.volume === 0) {
            video.volume = volume;
            setIsMuted(false);
        } else {
            video.volume = 0;
            setIsMuted(true);
        }
    };

    function increaseVolume() {
        if (volume < 1) {
            setVolume((prevVolume) => Math.min(prevVolume + 0.1, 1));
            setIsMuted(false);
        }
    };

    function decreaseVolume() {
        if (volume > 0) {
            setVolume((prevVolume) => Math.max(prevVolume - 0.1, 0));
            setIsMuted(false);
        }
    };

    function handleSeek(e) {
        const seekTime = parseFloat(e.target.value);
        videoRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };


    const forwardSeek = () => {
        seekByOffset(5);
    };

    const backwardSeek = () => {
        seekByOffset(-5);
    };

    const seekByOffset = (offset) => {
        const newTime = Math.max(Math.min(currentTime + offset, duration), 0);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const toggleFullScreen = () => {
        const player = playerRef.current;
        if (!document.fullscreenElement) {
            player.requestFullscreen()
                .then(() => console.log('Entered fullscreen mode'))
                .catch((err) => console.error('Failed to enter fullscreen', err));
        } else {
            document.exitFullscreen()
                .then(() => console.log('Exited fullscreen mode'))
                .catch((err) => console.error('Failed to exit fullscreen', err));
        }
        setIsFullScreen(!isFillScreen)
    };

    const handleSpeedChange = (e) => {
        const speed = parseFloat(e.target.value);
        setPlaybackSpeed(speed);
    };

    const toggleAutoPlay = () => {
        setAutoPlay(!autoPlay);
    };

    return (
        <div className='container'>
        <div className="video-player" ref={playerRef}>
            <video
                ref={videoRef}
                src={src}
                className="video"
                onEnded={() => setIsPlaying(false)}
                width={"100%"}
                // height={'100%'}
            ></video>
            <div className="controls" ref={controlsRef}>
                <div>
                    <input
                        type="range"
                        className='video-seek'
                        min={0}
                        max={duration}
                        value={currentTime}
                        onChange={handleSeek}
                    /></div>
                <div className='mains'>
                    <div className='left-controls'>
                        <button onClick={togglePlayPause}>
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <div className='span'>
                            {formatTime(currentTime)}/{formatTime(duration)}</div>
                        <button onClick={toggleMute} className='volume-toggle'>
                            {isMuted ? 'Unmute' : 'Mute'}
                        </button>
                        <input
                            type="range"
                            className='volume-range'
                            min={0}
                            max={1}
                            step={'any'}
                            value={volume}
                            onChange={handleVolumeChange}
                        /></div>
                    <div className='right-controls'>
                        <button onClick={toggleFullScreen}>
                            {isFillScreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        </button>
                        <input
                            type="range"
                            min={0.25}
                            max={2}
                            step={0.1}
                            value={playbackSpeed}
                            onChange={handleSpeedChange}
                        />
                        <button onClick={toggleAutoPlay}>
                            {autoPlay ? 'Disable Autoplay' : 'Enable Autoplay'}
                        </button></div>
                </div>
            </div>
        </div>
        <div className='discription'>
                <h4>{video.title}</h4>
                <p>{video.description}</p>
            </div>
        </div>
    );
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default VideoPlayer;
