let canvas = document.getElementById('previewSnap');
let context = canvas.getContext('2d');
let video = document.getElementById('video');
let previewSnap = document.getElementById('previewSnap');
let newPhotoButton = document.getElementById('newPhotoButton');
let snap = document.getElementById('snap');
let notificationButton = document.getElementById('notificationButton');
let galleryButton = document.getElementsByClassName('galleryButton');

let images;

if(localStorage.getItem('cameraApp') != null) {
    images = JSON.parse(localStorage.getItem('cameraApp'))
} else {
    images = []
}

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
    });
}

document.getElementById('snap').addEventListener('click', () => {
    context.drawImage(video, 0, 0, 640, 480);
    const imageData = canvas.toDataURL('image/png');
    
    images.push({
        id: Math.floor(Math.random() * (1000000000)),
        image: imageData
    });

    localStorage.setItem('cameraApp', JSON.stringify(images));

    snap.style.display = 'none';
    video.style.display = 'none';
    newPhotoButton.style.display = 'block';
    previewSnap.style.display = 'block';
    
    showNotification()
    updatePhotos(imageData)
})


function showNotification(){
    text = "Du tog en bild";
    const notification = new Notification('Notis', { body: text });
    notification.addEventListener('click', () => {
        window.open('https://localhost:443')
    })
}

function requestNotification(){ 
    Notification.requestPermission().then((permission) => {
        notificationPermisson = permission;
    })
}

newPhotoButton.addEventListener('click', () => {
    snap.style.display = 'block';
    video.style.display = 'block';
    newPhotoButton.style.display = 'none';
    previewSnap.style.display = 'none';
});

window.addEventListener('load', async () => {
    if('serviceWorker' in navigator){
        try {
            await (await navigator.serviceWorker.register('service-worker.js')).update();
        } catch(err){
            console.log('Did not work ', err)
        }
    }
})

const API_KEY_MASTER = '$2b$10$PPY2JA/itrU8vTdugDjMmuUyVF8nBMxLmoeMqNTGcSb3jnZNmTDHq' 

async function pushImages(){

    const response = await fetch('https://api.jsonbin.io/b/6297270605f31f68b3b1b0bb',{
        method: 'PUT',
        body: JSON.stringify({ images: images }),
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY_MASTER,
        }
    })

    const data = await response.json();
    console.log(data);
}

async function updatePhotos() {
    pushImages();
}

requestNotification();