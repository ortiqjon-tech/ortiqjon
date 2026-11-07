const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp');
const autoEat = require('mineflayer-auto-eat');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'ZVERO_007.aternos.me',
    port: 53628,
    username: 'Ultimate',
    auth: 'offline',
    version: false
  });

  bot.loadPlugin(pathfinder);
  bot.loadPlugin(pvp.plugin);
  bot.loadPlugin(autoEat.plugin);

  const targetPlayerName = 'ortiqjon007';
  let isAggressive = false; 
  let sneakCount = 0;
  let lastSneakTime = 0;
  let isSneaking = false;

  bot.on('spawn', () => {
    console.log('>>> BOT SERVERGA MUVAFFAQIYATLI KIRDI VA TAYYOR! <<<');
    
    setTimeout(() => {
      try {
        const mcData = require('minecraft-data')(bot.version);
        const defaultMove = new Movements(bot, mcData);
        
        defaultMove.canOpenDoors = true;
        defaultMove.allowParkour = true;
        
        bot.pathfinder.setMovements(defaultMove);
        bot.autoEat.options = { priority: 'foodPoints', startAt: 16 };
      } catch (e) {
        console.log('Sozlashda ogohlantirish:', e.message);
      }
      
      startAdvancedWandering();
      startInventoryUsage();
    }, 2000);
  });

  function startAdvancedWandering() {
    setInterval(() => {
      if (isAggressive || bot.pvp.target || !bot.entity) return;

      const rx = Math.floor(Math.random() * 30) - 15;
      const rz = Math.floor(Math.random() * 30) - 15;
      const p = bot.entity.position.offset(rx, 0, rz);

      try {
        bot.pathfinder.setGoal(new goals.GoalBlock(p.x, p.y, p.z));
      } catch (err) {}
    }, 10000);
  }

  function startInventoryUsage() {
    setInterval(async () => {
      if (!bot.inventory) return;

      try {
        const items = bot.inventory.items();
        if (items.length === 0) return;

        const sword = items.find(item => item.name.includes('sword') || item.name.includes('axe'));
        if (sword && bot.heldItem !== sword) {
          await bot.equip(sword, 'hand');
        }

        const helmet = items.find(item => item.name.includes('helmet'));
        if (helmet) await bot.equip(helmet, 'head');

        const chestplate = items.find(item => item.name.includes('chestplate'));
        if (chestplate) await bot.equip(chestplate, 'torso');

        const leggings = items.find(item => item.name.includes('leggings'));
        if (leggings) await bot.equip(leggings, 'legs');

        const boots = items.find(item => item.name.includes('boots'));
        if (boots) await bot.equip(boots, 'feet');

      } catch (err) {}
    }, 15000);
  }

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;

    const msg = message.toLowerCase();

    if (username === targetPlayerName && msg === 'tp') {
      bot.chat(`/tp ${targetPlayerName}`);
      bot.chat('Mana kelyapman!');
    }
    else if (msg.includes('salom') || msg.includes('qale')) {
      bot.chat(`Salom ${username}! Ishlar qalay?`);
    } 
    else if (msg.includes('qayerdasan')) {
      if (bot.entity) {
        const pos = bot.entity.position;
        bot.chat(`X: ${Math.floor(pos.x)}, Y: ${Math.floor(pos.y)}, Z: ${Math.floor(pos.z)}`);
      }
    }
    else if (msg.includes('inventar')) {
      const items = bot.inventory.items();
      const itemNames = items.map(i => `${i.name} (${i.count})`).join(', ');
      bot.chat(itemNames ? `Inventar: ${itemNames}` : 'Inventarim bo\'sh!');
    }
  });

  bot.on('entityUpdate', (entity) => {
    if (entity && entity.username === targetPlayerName) {
      const now = Date.now();
      
      if (entity.metadata && entity.metadata[0] === 2) { 
        if (!isSneaking) {
          isSneaking = true;
          if (now - lastSneakTime < 1500) {
            sneakCount++;
          } else {
            sneakCount = 1;
          }
          lastSneakTime = now;

          if (sneakCount >= 2) {
            isAggressive = false;
            bot.pvp.stop();
            bot.pathfinder.setGoal(null);
            bot.chat('Tushundim, urishmaymiz!');
            sneakCount = 0;
          }
        }
      } else {
        isSneaking = false;
      }
    }
  });

  bot.on('entityHurt', (entity) => {
    if (entity === bot.entity) {
      const attacker = bot.nearestEntity((e) => e.type === 'player' && e.username === targetPlayerName);
      if (attacker) {
        isAggressive = true;
        bot.pvp.attack(attacker);
        bot.chat('Urganing uchun javob berasan!');
      }
    }
  });

  setInterval(() => {
    if (!isAggressive) return;

    const playerEntity = bot.players[targetPlayerName]?.entity;
    if (playerEntity && !bot.pvp.target) {
      bot.pvp.attack(playerEntity);
    }
  }, 1000);

  bot.on('kicked', (reason) => console.log('Serverdan kick bo\'ldi:', reason));
  bot.on('end', () => {
    console.log('Ulanish uzildi. 20 sekunddan keyin qayta kiradi...');
    setTimeout(createBot, 20000);
  });
  bot.on('error', (err) => console.log('Xatolik:', err));
}

createBot();

const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot ishlayapti!\n');
}).listen(process.env.PORT || 3000);