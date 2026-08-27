import asyncio
import logging
from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, InputMediaPhoto, FSInputFile

# Sizning bot tokeningiz
TOKEN = "8859795302:AAGEJhmFCMMt4iNZF4541seF896LgMsyGuo"

# Loggingni sozlash
logging.basicConfig(level=logging.INFO)

# Bot va Dispatcher yaratish
bot = Bot(token=TOKEN)
dp = Dispatcher()

# Asosiy menyu tugmalari (Lokatsiya tugmasisiz)
main_menu = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="ℹ️ Biz haqimizda"), KeyboardButton(text="🛠 Xizmat turlari")],
        [KeyboardButton(text="🖼 Jarayondan rasmlar"), KeyboardButton(text="💰 Narxlar")],
        [KeyboardButton(text="⭐ Afzalliklarimiz"), KeyboardButton(text="📞 Bog'lanish")]
    ],
    resize_keyboard=True
)

# /start buyrug'i uchun handler
@dp.message(CommandStart())
async def start_handler(message: Message):
    text = (
        f"Assalomu alaykum, {message.from_user.first_name}!\n"
        "Suvoq apparati (shtukaturka) xizmatlari botiga xush kelibsiz. Kerakli bo'limni tanlang:"
    )
    await message.answer(text, reply_markup=main_menu)

# Biz haqimizda tugmasi
@dp.message(F.text == "ℹ️ Biz haqimizda")
async def about_handler(message: Message):
    text = (
        "<b>Suvoq apparati haqida:</b>\n\n"
        "Suvoq apparati (shtukaturning stansiyasi) — devor va shiftlarga qorishma "
        "(gips yoki sement-qum) purkash hamda tekislash ishlarini mexanizatsiyalashgan "
        "holda bajaradigan maxsus qurilish uskunasidir."
    )
    await message.answer(text, parse_mode="HTML")

# Xizmat turlari tugmasi
@dp.message(F.text == "🛠 Xizmat turlari")
async def services_handler(message: Message):
    text = (
        "<b>Biz taqdim etadigan xizmatlar:</b>\n\n"
        "• Mexanizatsiyalashgan gipsli suvoq\n"
        "• Sement-qum qorishmasi bilan devor suvoqi\n"
        "• Shift va devorlarni mukammal tekislash\n"
        "• Mayaklar bo'yicha sifatli ishlov berish"
    )
    await message.answer(text, parse_mode="HTML")

# Jarayondan rasmlar tugmasi (Tahrirlangan joyi)
@dp.message(F.text == "🖼 Jarayondan rasmlar")
async def photos_handler(message: Message):
    media = [
        InputMediaPhoto(media=FSInputFile("suvoq1.jpg"), caption="Suvoq apparati yordamida ish jarayoni"),
        InputMediaPhoto(media=FSInputFile("suvoq2.jpg"))
    ]
    await message.answer_media_group(media=media)

# Narxlar tugmasi
@dp.message(F.text == "💰 Narxlar")
async def prices_handler(message: Message):
    text = (
        "<b>Xizmatlar narxi:</b>\n\n"
        "• Kvadrat metri (kv.m) va boshqa shartlar obyektning holatiga qarab kelishiladi.\n"
        "• Sifatli material va tezkor xizmat kafolatlanadi!\n\n"
        "Aniq narxni bilish uchun telefon orqali bog'laning."
    )
    await message.answer(text, parse_mode="HTML")

# Afzalliklarimiz tugmasi
@dp.message(F.text == "⭐ Afzalliklarimiz")
async def advantages_handler(message: Message):
    text = (
        "<b>Nega aynan bizni tanlashadi?</b>\n\n"
        "⚡️ Qo'l mehnatiga nisbatan 4-5 barobar tezroq!\n"
        "🎯 Mukammal tekis yuzalar va yuqori sifat\n"
        "💰 Material va vaqtni tejaymiz\n"
        "🏆 Ishimizga to'liq kafolat beramiz"
    )
    await message.answer(text, parse_mode="HTML")

# Bog'lanish tugmasi
@dp.message(F.text == "📞 Bog'lanish")
async def contact_handler(message: Message):
    text = (
        "<b>BOG'LANISH UCHUN MA'LUMOTLAR:</b>\n\n"
        "👤 <b>MAS'UL SHAXS:</b> Xudayberganov Ixtiyor\n"
        "📞 <b>TELEFON RAQAM:</b> +998 99 577 32 22 \n\n"
    )
    await message.answer(text, parse_mode="HTML", disable_web_page_preview=False)

# Asosiy ishga tushirish funksiyasi
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())