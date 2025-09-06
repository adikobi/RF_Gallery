const firebaseConfig = {
    apiKey: "AIzaSyCCuLkveSmep82urdBA2FvLWOv5PCQRwZY",
    authDomain: "rf-gallery-be77e.firebaseapp.com",
    projectId: "rf-gallery-be77e",
    storageBucket: "rf-gallery-be77e.appspot.com",
    messagingSenderId: "194565825423",
    appId: "1:194565825423:web:c266f2976ffb295a33a1fa"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();


document.addEventListener('DOMContentLoaded', () => {
    // Code for the home page (index.html)
    if (document.getElementById('exhibits-grid')) {
        loadExhibits();
        setupAddExhibitModal();
    }

    // Code for the exhibit page (exhibit.html)
    if (document.getElementById('gallery-grid')) {
        const urlParams = new URLSearchParams(window.location.search);
        const exhibitId = urlParams.get('exhibitId');
        if (exhibitId) {
            loadGallery(exhibitId);
            setupAddImageModal(exhibitId);
        } else {
            console.error("No exhibit ID found in URL.");
            window.location.href = 'index.html';
        }
    }
});

// ----------------- Home Page Functions -----------------

function loadExhibits() {
    const exhibitsGrid = document.getElementById('exhibits-grid');
    db.collection('exhibits').orderBy('date', 'desc').onSnapshot(snapshot => {
        exhibitsGrid.innerHTML = ''; // Clear existing exhibits
        snapshot.forEach(doc => {
            const exhibit = { id: doc.id, ...doc.data() };
            const exhibitElement = createExhibitElement(exhibit);
            exhibitsGrid.appendChild(exhibitElement);
        });
        // Add the "add new" frame after the exhibits
        const addExhibitFrame = createAddExhibitFrame();
        exhibitsGrid.appendChild(addExhibitFrame);
    });
}

function createExhibitElement(exhibit) {
    const element = document.createElement('div');
    element.className = 'exhibit-frame';
    element.style.backgroundImage = 'url(images/frame.png)';
    element.innerHTML = `
        <img src="${exhibit.imageUrl}" alt="${exhibit.name}">
        <div class="exhibit-info">
            <h3>${exhibit.name}</h3>
            <p>${exhibit.date}</p>
        </div>
    `;
    element.addEventListener('click', () => {
        window.location.href = `exhibit.html?exhibitId=${exhibit.id}`;
    });
    return element;
}

function createAddExhibitFrame() {
    const element = document.createElement('div');
    element.className = 'exhibit-frame';
    element.style.backgroundImage = 'url(images/frame.png)';
    element.innerHTML = `
        <div class="exhibit-info">
            <h3>Add New Exhibit</h3>
        </div>
    `;
    element.addEventListener('click', () => {
        document.getElementById('add-exhibit-modal').style.display = 'block';
    });
    return element;
}

function setupAddExhibitModal() {
    const modal = document.getElementById('add-exhibit-modal');
    const form = document.getElementById('add-exhibit-form');
    const closeButton = modal.querySelector('.close-button');

    document.getElementById('exhibit-date').valueAsDate = new Date();

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('exhibit-name').value;
        const date = document.getElementById('exhibit-date').value;
        const imageFile = document.getElementById('exhibit-image').files[0];

        if (name && date && imageFile) {
            const storageRef = storage.ref(`exhibits/${imageFile.name}`);
            storageRef.put(imageFile).then(snapshot => {
                snapshot.ref.getDownloadURL().then(downloadURL => {
                    db.collection('exhibits').add({
                        name: name,
                        date: date,
                        imageUrl: downloadURL
                    }).then(() => {
                        modal.style.display = 'none';
                        form.reset();
                        document.getElementById('exhibit-date').valueAsDate = new Date();
                    }).catch(error => console.error("Error adding document: ", error));
                });
            }).catch(error => console.error("Error uploading file: ", error));
        }
    });
}

// ----------------- Exhibit Page Functions -----------------

function loadGallery(exhibitId) {
    const galleryGrid = document.getElementById('gallery-grid');
    const exhibitTitle = document.getElementById('exhibit-title');

    // Fetch exhibit title
    db.collection('exhibits').doc(exhibitId).get().then(doc => {
        if (doc.exists) {
            exhibitTitle.textContent = doc.data().name;
        } else {
            console.error("No such exhibit!");
        }
    }).catch(error => console.error("Error getting exhibit:", error));

    // Load gallery images
    db.collection('exhibits').doc(exhibitId).collection('images').orderBy('date', 'desc').onSnapshot(snapshot => {
        galleryGrid.innerHTML = ''; // Clear existing images
        snapshot.forEach(doc => {
            const image = { id: doc.id, ...doc.data() };
            const galleryItem = createGalleryItemElement(image, exhibitId);
            galleryGrid.appendChild(galleryItem);
        });
        const addImageFrame = createAddImageFrame(exhibitId);
        galleryGrid.appendChild(addImageFrame);
    });
}

function createGalleryItemElement(image, exhibitId) {
    const element = document.createElement('div');
    element.className = 'gallery-item';
    element.style.backgroundImage = 'url(images/frame.png)';
    element.innerHTML = `
        <img src="${image.imageUrl}" alt="${image.title}">
        <div class="gallery-item-info">
            <h4>${image.title}</h4>
            <p>${image.date}</p>
            <button class="edit-btn">Edit</button>
        </div>
    `;
    element.querySelector('img').addEventListener('click', () => {
        setupViewImageModal(image);
    });
    element.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        setupEditImageModal(image, exhibitId);
    });
    return element;
}

function createAddImageFrame(exhibitId) {
    const element = document.createElement('div');
    element.className = 'gallery-item';
    element.style.backgroundImage = 'url(images/frame.png)';
    element.innerHTML = `
        <div class="gallery-item-info">
            <h4>Add New Image</h4>
        </div>
    `;
    element.addEventListener('click', () => {
        document.getElementById('add-image-modal').style.display = 'block';
    });
    return element;
}

function setupAddImageModal(exhibitId) {
    const modal = document.getElementById('add-image-modal');
    const form = document.getElementById('add-image-form');
    const closeButton = modal.querySelector('.close-button');

    document.getElementById('image-date').valueAsDate = new Date();

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('image-title').value;
        const date = document.getElementById('image-date').value;
        const description = document.getElementById('image-description').value;
        const imageFile = document.getElementById('image-file').files[0];

        if (title && date && imageFile) {
            const storageRef = storage.ref(`images/${exhibitId}/${imageFile.name}`);
            storageRef.put(imageFile).then(snapshot => {
                snapshot.ref.getDownloadURL().then(downloadURL => {
                    db.collection('exhibits').doc(exhibitId).collection('images').add({
                        title: title,
                        date: date,
                        description: description,
                        imageUrl: downloadURL
                    }).then(() => {
                        modal.style.display = 'none';
                        form.reset();
                        document.getElementById('image-date').valueAsDate = new Date();
                    }).catch(error => console.error("Error adding image document: ", error));
                });
            }).catch(error => console.error("Error uploading image file: ", error));
        }
    });
}

function setupViewImageModal(image) {
    const modal = document.getElementById('view-image-modal');
    const imgElement = document.getElementById('full-screen-image');
    const descriptionElement = document.getElementById('full-screen-description');
    const closeButton = modal.querySelector('.close-button');

    imgElement.src = image.imageUrl;
    descriptionElement.textContent = image.description;
    modal.style.display = 'block';

    closeButton.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

function setupEditImageModal(image, exhibitId) {
    const modal = document.getElementById('edit-image-modal');
    const form = document.getElementById('edit-image-form');
    const closeButton = modal.querySelector('.close-button');

    document.getElementById('edit-image-id').value = image.id;
    document.getElementById('edit-image-title').value = image.title;
    document.getElementById('edit-image-date').value = image.date;
    document.getElementById('edit-image-description').value = image.description;

    modal.style.display = 'block';

    closeButton.onclick = () => modal.style.display = 'none';

    form.onsubmit = (event) => {
        event.preventDefault();
        const imageId = document.getElementById('edit-image-id').value;
        const title = document.getElementById('edit-image-title').value;
        const date = document.getElementById('edit-image-date').value;
        const description = document.getElementById('edit-image-description').value;
        const imageFile = document.getElementById('edit-image-file').files[0];

        const imageRef = db.collection('exhibits').doc(exhibitId).collection('images').doc(imageId);

        if (imageFile) {
            // If a new file is uploaded, upload it and then update the doc
            const storageRef = storage.ref(`images/${exhibitId}/${imageFile.name}`);
            storageRef.put(imageFile).then(snapshot => {
                snapshot.ref.getDownloadURL().then(downloadURL => {
                    imageRef.update({
                        title,
                        date,
                        description,
                        imageUrl: downloadURL
                    }).then(() => modal.style.display = 'none');
                });
            });
        } else {
            // If no new file, just update the text fields
            imageRef.update({
                title,
                date,
                description
            }).then(() => modal.style.display = 'none');
        }
    };
}
