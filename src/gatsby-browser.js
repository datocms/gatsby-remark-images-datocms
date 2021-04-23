exports.onRouteUpdate = () => {
  const videoWrappers = document.querySelectorAll('.gatsby-resp-video-wrapper');

  for (let i = 0; i < videoWrappers.length; i++) {
    const videoWrapper = videoWrappers[i];

    const backgroundElement = videoWrapper.querySelector(
      '.gatsby-resp-video-background-image',
    );
    const videoElement = videoWrapper.querySelector('.gatsby-resp-video-video');

    const onLoadedData = () => {
      backgroundElement.style.transition = 'opacity 0.5s 0.5s';
      backgroundElement.style.opacity = 0;
      videoElement.style.transition = 'opacity 0.5s';
      videoElement.style.opacity = 1;
      videoElement.removeEventListener('loadeddata', onLoadedData);
    };

    if (videoElement.readyState === 4) {
      backgroundElement.style.opacity = 0;
    } else {
      videoElement.style.opacity = 0;
      videoElement.addEventListener('loadeddata', onLoadedData);
    }
  }
};
