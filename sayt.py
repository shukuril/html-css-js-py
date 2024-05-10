import asyncio
from aiogram import Bot, Dispatcher, executor

token_bot = ""

loop = asyncio.new_event_loop()
bot = Bot(token_bot, parse_mode="HTML")
dp = Dispatcher(bot, loop)

if __name__== '__main__':
    from handlers import dp
    executor.start_polling(dp)
    