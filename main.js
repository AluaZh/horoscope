const button = document.getElementById('button');

button.addEventListener('click', async function(event){
    // Остановить обновление 
    event.preventDefault(); 

    // Провить введена ли инфа
    const name_ = document.getElementById('name').value;
    if(!name_){
        alert('Введите имя');
        return;
    };

    const checkbox = document.getElementById('checkButton').checked;
    if(!checkbox){
        alert('Нужно верить!');
        return;
    };

    const birth = document.getElementById('birthday').value;
    if(!birth){
        alert('Введите дату рождения!');
        return;
    }
    const birthMonth = birth.slice(5,7);
    const birthDay = birth.slice(8);
    const {sign, imgURL, elem} = chooseSign(birthMonth, birthDay);

    const day = document.getElementById('select').value;
    if(!day){
        alert('Введите день!');
        return;
    };

    // Инфа с API и перевод 
    try {
        const data = await getInfo(sign, day);
        const horoscopeInfo = data.horoscope;
        const index = findIndex(horoscopeInfo);

        const slicedHoroscope = horoscopeInfo.slice(0, index + 1);
        const translatedHoroscope = await translateText(slicedHoroscope);
        const translatedSign = await translateText(sign);
        const mood = await translateText(data.meta.mood);
        const percent = data.meta.intensity;

        showHoroscope(
            translatedSign.toUpperCase(),
            birth,
            imgURL,
            elem,
            translatedHoroscope || slicedHoroscope,
            mood[0].toUpperCase() + mood.slice(1),
            percent
        );

        if(!translatedHoroscope) {
            alert('Не смогли перевести ваш гороскоп');
        };
    } catch(error) {
        console.error('Ошибка:', error);
        alert('Ошибка. Попробуйте ещё раз')
    };
});

async function getInfo(sign, day){
    const url = `http://sandipbgt.com/theastrologer/api/horoscope/${sign}/${day}/`
    
    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error('Ошибка сети');
        }
        return await response.json();
    } catch(error) {
        console.error('Ошибка:', error);
        throw error;
    }
};

function chooseSign(month, day){
    const signs = [
        { sign: 'aries', imgURL: 'img/icons8-овен-100.png', elem: 'Огонь', start: '03-21', end: '04-19' },
        { sign: 'taurus', imgURL: 'img/icons8-телец-100.png', elem: 'Земля', start: '04-20', end: '05-20' },
        { sign: 'gemini', imgURL: 'img/icons8-близнецы-100.png', elem: 'Воздух', start: '05-21', end: '06-21' },
        { sign: 'cancer', imgURL: 'img/icons8-рак-100.png', elem: 'Вода', start: '06-22', end: '07-22' },
        { sign: 'leo', imgURL: 'img/icons8-лев-100.png', elem: 'Огонь', start: '07-23', end: '08-22' },
        { sign: 'virgo', imgURL: 'img/icons8-дева-100.png', elem: 'Земля', start: '08-23', end: '09-22' },
        { sign: 'libra', imgURL: 'img/icons8-весы-100.png', elem: 'Воздух', start: '09-23', end: '10-23' },
        { sign: 'scorpio', imgURL: 'img/icons8-скорпион-100.png', elem: 'Вода', start: '10-24', end: '11-22' },
        { sign: 'sagittarius', imgURL: 'img/icons8-стрелец-100.png', elem: 'Огонь', start: '11-23', end: '12-21' },
        { sign: 'capricorn', imgURL: 'img/icons8-козерог-100.png', elem: 'Земля', start: '12-22', end: '01-20' },
        { sign: 'aquarius', imgURL: 'img/icons8-водолей-100.png', elem: 'Воздух', start: '01-21', end: '02-18' },
        { sign: 'pisces', imgURL: 'img/icons8-рыбы-100.png', elem: 'Вода', start: '02-19', end: '03-20' },
    ];

    return signs.find(({start, end}) => (month + '-' + day >= start && month + '-' + day <= end) || (month === '02' && day === '29' && signs === 'pisces')) || {};
};

function showHoroscope(sign, birth, imgURL, elem, horoscope, mood, percent){
    const cardContainer = document.querySelector('.twinkling');
    cardContainer.innerHTML = `
        <div id="card2">
            <h1>${sign}</h1>
            <h6>(${birth})</h6>
            <img src="${imgURL}" alt="sign">
            <p id="elem"><span>Стихия:</span> ${elem}</p>
            <p id="horoscope"><span>Гороскоп:</span> ${horoscope}</p>
            <p id="mood"><span>Настрой на день:</span> ${mood}</p>
            <p id="percent"><span>Достоверность прогноза</span> - ${percent}</p>
        </div>
    `;
};

async function translateText(value) {
    const apiURL = `https://api.mymemory.translated.net/get?q=${value}&langpair=English|Russian`;
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        if (data.responseStatus === 200) {
            return data.responseData.translatedText; // Возвращаем переведенный текст
        } else {
            console.error('Ошибка при получении перевода:', data.responseStatus);
            return value; // Если произошла ошибка, возвращаем исходный текст
        }
    } catch (error) {
        console.error('Ошибка при запросе на перевод:', error);
        return value; // Если произошла ошибка, возвращаем исходный текст
    }
};

function findIndex(info){
    const dotIndex = info.indexOf('.');
    const askIndex = info.indexOf('?');
    
    if (dotIndex === -1 && askIndex !== -1) {
        return askIndex;
    } else if (dotIndex !== -1 && askIndex === -1) {
        return dotIndex;
    } else if (dotIndex !== -1 && askIndex !== -1) {
        return Math.min(dotIndex, askIndex);
    } else {
        return -1;
    }
};







