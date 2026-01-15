export default function decorate(block) {
  const VIDEO_EXTENSIONS = [
    '.mp4',
    '.webm',
    '.ogg',
    '.ogv',
    '.mov',
    '.avi',
    '.wmv',
    '.flv',
    '.mkv',
    '.m4v',
    '.3gp',
    '.3g2',
    '.mpg',
    '.mpeg',
    '.m2v',
    '.m4p',
    '.divx',
    '.xvid',
    '.vob',
    '.ts',
    '.mts',
    '.m2ts',
  ];

  const rows = Array.from(block.children);

  // Get video source from the first row
  const videoSrc = rows[0]?.querySelector('a')?.href;

  // Clear block content
  block.innerHTML = '';

  // Check if the file is a video type
  const isVideo = videoSrc
    && VIDEO_EXTENSIONS.some((ext) => videoSrc.toLowerCase().endsWith(ext));

  if (videoSrc && isVideo) {
    // Create wrapper div
    const cardVideo = document.createElement('div');
    cardVideo.className = 'video-card';

    // Create video element
    const video = document.createElement('video');
    video.muted = true;
    video.preload = 'auto';
    video.autoplay = true;
    video.loop = true;
    video.playsInline = true;
    video.className = 'video-card-background';

    // Create source element
    const source = document.createElement('source');
    source.src = videoSrc;
    source.type = 'video/mp4';

    // Add fallback text
    const fallbackText = document.createTextNode('Your browser does not support the video tag.');

    video.appendChild(source);
    video.appendChild(fallbackText);
    cardVideo.appendChild(video);
    block.appendChild(cardVideo);
  } else {
    console.error(
      'Invalid video file. Please upload a video file (.mp4, .webm, .ogg, .mov, etc.)',
    );
  }
}
