const submenus = document.querySelectorAll('nav .menubar .menu-content .submenu');
const appControl = document.querySelectorAll('nav .app-control div');
const imageContainer = document.querySelector('#image-container');

const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';

let currentImageIndex = 0;
let imagePaths = [];

function showImage(index) {
    if (imagePaths.length > 0) {
        imageContainer.innerHTML = ''; // Clear any existing images
        const img = document.createElement('img');
        img.src = imagePaths[index];
        img.alt = 'Image';
        img.classList.add('image-item'); // Add a class for styling if needed
        imageContainer.appendChild(img);
    }
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + imagePaths.length) % imagePaths.length;
    showImage(currentImageIndex);
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % imagePaths.length;
    showImage(currentImageIndex);
}

window.images.onReceiveImages(paths => {
    imagePaths = [...paths];
    currentImageIndex = 0;
    showImage(currentImageIndex);
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % imagePaths.length;
        showImage(currentImageIndex);
    } else if (event.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + imagePaths.length) % imagePaths.length;
        showImage(currentImageIndex);
    }
});

document.getElementById('prev-image').addEventListener('click', prevImage);
document.getElementById('next-image').addEventListener('click', nextImage);

appControl.forEach(control => control.addEventListener('click', function(){
    switch(control.classList[0]){
        case 'close':
            window.appControls.closeApp();
            break;
        case 'minimize':
            window.appControls.minimizeApp();
            break;
        case 'maximize':
            window.appControls.maximizeApp();
            break;
        default:
            break;
    }
}))

submenus.forEach( submenu => {
    if(!isDev)
    {
        if(submenu.classList[1] === 'devtool')
        {
            submenu.style.display = 'none';
        }
    }
    submenu.addEventListener('click', function(){
        switch(submenu.classList[1]){
            case 'quit':
                window.appControls.closeApp();
                break;
            case 'about':
                window.appControls.showAppVersion();
                break;
            case 'devtool':
                window.appControls.toggleDevTools();
                break;
            case 'browse': // Add this case
                window.appControls.browseImageFolder();
                break;
            case 'fullscreen':
                window.appControls.maximizeApp();
                break;
            default:
                break;
        }
    })
});
