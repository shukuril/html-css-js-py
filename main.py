import json
import requests
from aiogram import Bot, Dispatcher, executor, types
from aiogram.types.web_app_info import WebAppInfo

bot = Bot('6963877013:AAFUrMcy-J8K6syj4_KLoEZVuMbCZ2hFpt0')
dp = Dispatcher(bot)

# Функция для получения данных с веб-сайта
def fetch_data_from_website():
    try:
        # Замените 'example.com' на реальный URL веб-сайта
        response = requests.get('http://example.com/api/data')
        # Предполагается, что веб-сайт возвращает данные в формате JSON
        data = response.json()
        return data
    except Exception as e:
        print("Ошибка при получении данных с веб-сайта:", e)
        return None

@dp.message_handler(commands=['start'])
async def start(message: types.Message):
    inline_markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    inline_markup.add(types.KeyboardButton('Открыть веб страницу', web_app=WebAppInfo(url='https://shukuril.github.io/shukuril/')))
    await message.answer('Привет', reply_markup=inline_markup)

@dp.message_handler(content_types=['web_app_data'])
async def web_app(message: types.Message):
    res = json.loads(message.web_app_data.data)
    await message.answer(res)

@dp.message_handler(commands=['fetch_data'])
async def fetch_and_send_data(message: types.Message):
    # Получаем данные с веб-сайта
    website_data = fetch_data_from_website()
    if website_data:
        # Отправляем полученные данные пользователю
        await message.answer("Data fetched from the website:")
        await message.answer(json.dumps(website_data, indent=4))
    else:
        await message.answer("Failed to fetch data from the website.")

# Начинаем опрос
executor.start_polling(dp)
