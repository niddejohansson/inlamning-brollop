let gallery = document.getElementById('gallery');
const API_KEY_MASTER = '$2b$10$PPY2JA/itrU8vTdugDjMmuUyVF8nBMxLmoeMqNTGcSb3jnZNmTDHq'

let images;

if(localStorage.getItem('cameraApp') != null) {
    images = JSON.parse(localStorage.getItem('cameraApp'))
} else {
    images = []
}

function createGallery(image){
    const imageElem = document.createElement('img');
    const deleteImage = document.createElement('button');
    const pictureDiv = document.createElement('div');

    deleteImage.addEventListener('click', () => {
        const deleteImages = JSON.parse(localStorage.getItem('cameraApp'));
        let newArray = deleteImages.filter(pickedImage => image.id != pickedImage.id);
        window.localStorage.setItem('cameraApp', JSON.stringify(newArray));
        imageElem.remove(imageElem);
        deleteImage.remove(deleteImage);
        pictureDiv.remove(pictureDiv);
    });
    
    imageElem.setAttribute('src', image.image)

    pictureDiv.append(imageElem);
    pictureDiv.append(deleteImage);
    pictureDiv.classList.add('pictureDiv')
    gallery.append(pictureDiv);
    imageElem.classList.add('picture')
    deleteImage.classList.add('deleteImage')
}


function getGallery(data){
    console.log(data)
    for(const image of data) {
        createGallery(image)
    }
}

async function getImagesFromBin(){
    const response = await fetch('https://api.jsonbin.io/b/6297270605f31f68b3b1b0bb/latest', { 
        headers: { 
            'X-Master-Key': API_KEY_MASTER
        }
    });
    const data = await response.json();
    getGallery(data.images);
}

getImagesFromBin();
getGallery(images);