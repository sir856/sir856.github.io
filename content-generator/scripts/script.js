let canvas = document.createElement('canvas');
const body =  document.getElementsByTagName('body')[0];
body.appendChild(canvas);
canvas.width = 500;
canvas.height = 500;
let ctx = canvas.getContext('2d');

imageRequest();

let div = document.createElement('div');
body.appendChild(div);
div.style.width = '500px';
div.style.display = 'flex';

let button = document.createElement('button');
div.appendChild(button);
button.textContent = 'Generate';
button.style.width = '50%';
button.onclick = function () {
    imageRequest();
};

let buttonSave = document.createElement('button');
div.appendChild(buttonSave);
buttonSave.textContent = 'Download';
buttonSave.style.width = '50%';
buttonSave.onclick = function () {
    let link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = "image.png";
    link.click();

};

function imageRequest(){
    $.ajax({
        url: 'https://api.unsplash.com/photos/random?client_id=c5d7d717a09724e63caa42d78fb0a24e39c80d0e167118011b667e38152aa496&count=4',
        dataType: 'json',
        type: 'GET',
        timeout: 1000
    })
        .done(setImage)
        .fail(function() {
            alert('image request failed')
        })
}

function textRequest() {
    $.ajax({
        url: 'https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=ru&jsonp=?',
        dataType: 'jsonp',
        timeout: 1000
    })
        .done(setText)
        .fail('text request failed')
}

async function setImage(result) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let pic1 = new Image(), pic2 = new Image(), pic3 = new Image(), pic4 = new Image();
    pic1.crossOrigin = 'Anonymous';
    pic2.crossOrigin = 'Anonymous';
    pic3.crossOrigin = 'Anonymous';
    pic4.crossOrigin = 'Anonymous';
    pic1.src = result[0].urls.small;
    pic2.src = result[1].urls.small;
    pic3.src = result[2].urls.small;
    pic4.src = result[3].urls.small;

    await wait([pic1, pic2, pic3, pic4]);
    textRequest();

    scaleRand(pic1);
    let width = canvas.width - pic1.width;
    let height = canvas.height - pic1.height;

    scale(pic2, width, pic1.height);
    scale(pic3, pic1.width, height);
    scale(pic4, width, height);

    ctx.drawImage(pic1, 0, 0, pic1.width, pic1.height);
    ctx.drawImage(pic2, pic1.width, 0, pic2.width, pic2.height);
    ctx.drawImage(pic3, 0, pic1.height, pic3.width, pic3.height);
    ctx.drawImage(pic4, pic1.width, pic1.height, pic4.width, pic4.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function setText(result) {
    const words = result.quoteText.split(' ');
    if (words.length > 20){
        textRequest();
        return 0;
    }

    ctx.font = '28px bold';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let text = [];
    let line = words[0] + ' ';
    let maxWidth = 0.8 * canvas.width;

    for (let i = 1; i < words.length; i++) {
        let newLine = line + words[i] + ' ';
        if (ctx.measureText(newLine).width > maxWidth) {
            text.push(line);
            line = words[i] + ' ';
        }
        else {
            line = newLine;
        }
    }

    text.push(line);
    let lineHeight = parseInt(ctx.font);
    let y = (canvas.height - text.length * lineHeight) / 2;

    for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], canvas.width / 2, y + i * lineHeight);
    }
}

function wait(pics) {
    return Promise.all(pics.map(waitPic))
}

function waitPic(pic) {
    return new Promise(function (resolve) {
        pic.onload = resolve;
    })
}

function getRand() {
    let nums = [150, 200, 250, 300, 350];
    return nums[Math.floor(Math.random() * nums.length)]
}

function scaleRand(img) {
    let width = img.width;
    img.width = getRand();
    img.height *= img.width / width;
    if (img.height > canvas.height) {
        img.width *= (0.9 * canvas.height) / img.height;
        img.height = 0.9 * canvas.height;
    }
}

function scale(img, width, height) {
    if (img.width < width) {
        img.height *= width / img.width;
        img.width = width;
    }

    if (img.height < height) {
        img.width *= height / img.height;
        img.height = height;
    }
}