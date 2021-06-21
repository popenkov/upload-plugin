function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (!bytes) { return '0 Byte';}
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
 }

 const element = (tag, classes=[], content) => {
    const node = document.createElement(tag);

    if(classes.length) {
        node.classList.add(...classes)
    }

    if (content) {
        node.textContent = content;
    }

    return node;
 }

 const noop = function () {};

export function upload(selector, options = {}) {
    let files = [];
    const onUpload = options.onUpload ?? noop; //если функция не была передана, то будет вызвана пустая нуп
    const input = document.querySelector(selector);
    const preview = element('div', ['preview']);

    const open = element('button', ['btn'], "Открыть");
    const upload = element('button', ['btn', 'primary'], "Загрузить");
    upload.style.display = 'none';
    
/*     document.createElement('button');
    open.classList.add('btn');
    open.textContent="Открыть"; */

    if (options.multi) {
        input.setAttribute('multiple', true)
    }

    if (options.accept && Array.isArray(options.accept)) {
        input.setAttribute('accept', options.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', upload);
    input.insertAdjacentElement('afterend', open);

    const triggerInput = () => input.click();

    open.addEventListener('click', triggerInput);

    const changeHandler = (evt) => {
        if (!evt.target.files.length) {
            return;
        } 

        files = Array.from(evt.target.files); //это не массив и надо привести к массиву
        upload.style.display = 'inline';
        preview.innerHTML = '';
        files.forEach(file => {
            if (!file.type.match('image')){
                return;
            }

            const reader = new FileReader();

            reader.onload = evt => {
                const src = evt.target.result;
                preview.insertAdjacentHTML('afterbegin', 
                `<div class="preview-image">
                    <div class="preview-remove" data-name="${file.name}">&times;</div>
                    <img  src="${src}" alt="${file.name}">
                    <div class="preview-info">
                        <span>${file.name}</span>
                        ${bytesToSize(file.size)}
                    </div>

                </div>
                `)
               /*  input.insertAdjacentHTML('afterend', `<img src="${evt.target.result}">`) */
            }; //если добавим после ридера, то есть шанс, что он не сработает

            reader.readAsDataURL(file);

        })
    }

    const removeHandler = function (evt) {
        if (!evt.target.dataset) {
            return;
        } 
        
        const {name} = evt.target.dataset;
        files = files.filter(item => item.name !== name );

        if (!files.length) {
            upload.style.display ='none';
        }

        const block = preview.querySelector(`[data-name="${name}"]`)
            .closest('.preview-image');
        
        block.classList.add('removing');
        setTimeout(() => block.remove(), 300);

        
    }
    const clearPreview = el => {
        el.style.bottom = '0px'; //чтобы был виден всегда блок
        el.innerHTML = `<div class="preview-info-progress"></div>`
    }
    const uploadHandler = () => {
        preview.querySelectorAll ('.preview-remove').forEach(item => { // чтобы нельзя было удалять фото после нажатия кнопки загрузки.
            item.remove();
        })
        // изменяем в карточке превью инфо.  тут будет прогрессбар
        const previewInfo = preview.querySelectorAll('.preview-info');
        previewInfo.forEach(clearPreview)

         onUpload(files, previewInfo)
    }

    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler);
    upload.addEventListener('click', uploadHandler);
}