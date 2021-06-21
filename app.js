import firebase from 'firebase/app';
import 'firebase/storage';
import {upload} from './upload';

const firebaseConfig = {
    apiKey: "AIzaSyASjwUlSZieNXASJ0_LnqRtnHHas5URPc8",
    authDomain: "fe-upload-eeb23.firebaseapp.com",
    projectId: "fe-upload-eeb23",
    storageBucket: "fe-upload-eeb23.appspot.com",
    messagingSenderId: "79329146369",
    appId: "1:79329146369:web:0f19784c28e6252d233200"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const storage = firebase.storage();


upload('#file', {
    multi: true,
    accept: ['.jpg','.png', '.jpeg', '.gif'],
    onUpload (files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`images/${file.name}`); // создаем путь, куда будет сохранятся
            const task = ref.put(file); // операция сохранения

            //progressbar
            task.on('state_changed', snapshot => { // прослушка событий. snapshot показывает сколько информации уже передано
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) +'%';
                const block = blocks[index].querySelector('.preview-info-progress');
                block.textContent = percentage;
                block.style.width = percentage;
            }, error => {
                console.log(error)
            }, () => { //complete
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download URL', url)
                }) 
            })
        })
    }
});