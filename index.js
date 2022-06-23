const TelegramApi = require('node-telegram-bot-api')

const token = '5463162428:AAEf4SRafqzlY9pRctprYHKaVIJMVsUZ1z4'

const chats = {}
const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 1, callback_data: '1'}, {text: 2, callback_data: '2'}, {text: 3, callback_data: '3'}],
            [{text: 4, callback_data: '4'}, {text: 5, callback_data: '5'}, {text: 6, callback_data: '6'}],
            [{text: 7, callback_data: '7'}, {text: 8, callback_data: '8'}, {text: 9, callback_data: '9'}]
        ]
    })
}

const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Начать Заново', callback_data: '/again'}]
        ]
    })
}




const bot = new TelegramApi(token, {polling: true})


async function startGame(chatId){
    await bot.sendMessage(chatId, `Давай поиграем, я загадаю число от 0-9, а ты попробуй угадай`)
    const randomNumber = Math.floor(Math.random()*10)
    console.log(randomNumber)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `отгадывай`, gameOptions)
}

function start(){
    bot.setMyCommands([
        {
            command: '/start', description: 'Начальное приветсвие'
        },
        {
            command: '/game', description: 'Давай поиграем'
        }
    ])

    bot.on('message', async msg=>{
        const text = msg.text;
        const chatId = msg.chat.id;


        if(text==='/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/192/87.webp')
            return bot.sendMessage(chatId, `Привет ${msg.from.first_name}, Добро пожаловать в бот Эвелиночки!! можем пообщаться`)
        }

        if(text==='/info'){
            return bot.sendMessage(chatId, `Тебя Зовут ${msg.from.first_name}`)
        }else if(text==='/game'){
            return startGame(chatId)
        }else{
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/192/73.webp')
        }

    })


    bot.on('callback_query', async msg=>{
        const data = msg.data
        const chatId = msg.message.chat.id

        if(data==='/again'){
            return startGame(chatId)
        }

        if(+data === chats[chatId]){
            await bot.sendMessage(chatId, `Ура!!! Ты отгадал(а)`)
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/192/36.webp')
        }else{
            await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/192/39.webp`)
            return bot.sendMessage(chatId, `НЕТ! Пробуй еще`, againOptions)

        }

    })
}

start()