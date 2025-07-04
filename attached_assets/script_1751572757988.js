// Установка фона
const background = document.querySelector('.background');
const bgType = getComputedStyle(document.documentElement).getPropertyValue('--background-type').trim();
if (bgType === 'image') {
    background.classList.add('image');
} else if (bgType === 'gradient') {
    background.classList.add('gradient');
} else if (bgType === 'video') {
    const video = document.createElement('video');
    video.src = getComputedStyle(document.documentElement).getPropertyValue('--background-video').trim();
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    background.appendChild(video);
}

// Функционал аудиоплеера
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const seekBar = document.getElementById('seekBar');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');

audio.src = getComputedStyle(document.documentElement).getPropertyValue('--music-url').trim();

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = '⏸';
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶️';
    }
});

audio.addEventListener('loadedmetadata', () => {
    seekBar.max = audio.duration;
    duration.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    seekBar.value = audio.currentTime;
    currentTime.textContent = formatTime(audio.currentTime);
});

seekBar.addEventListener('input', () => {
    audio.currentTime = seekBar.value;
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}