const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'ZVERO_007.aternos.me', // Aternos server manzili
  port: 53628,               // Port raqami
  username: 'AternosBot',    // Botning nik nomi
  version: false             // Avtomatik versiya
});

bot.on('spawn', () => {
  console.log('Bot serverga muvaffaqiyatli ulandi va haqiqiy player sifatida kirdi!');
});

setInterval(() => {
  if (bot.player) {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }
}, 180000);

bot.on('end', (reason) => {
  console.log('Bot ulanishdan uzildi, qayta ulanmoqda...', reason);
});

bot.on('error', (err) => {
  console.log('Xatolik yuz berdi:', err);
});


