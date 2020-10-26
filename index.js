require('dotenv').config();
const cron = require('node-cron');
const startVK = require('./vkontakte');
const { saveGame, findGame } = require('./firebase');
const { sendMessage } = require('./telegram');

async function getGames() {
  const vk = await startVK();
  const vkr = await vk.call('wall.get', {
    domain: 'strikeball61',
    count: 10,
  });

  const { items } = vkr;
  const games = items.filter((el) => /ВОСКРЕСНАЯ ИГРА/gi.test(el.text));
  const parsedGames = games.map(({ id, text }) => {
    const matchDate = /(?<game>ВОСКРЕСНАЯ ИГРА).* (?<date>\d{1,2}\.\d{1,2}\.\d{4})/gi.exec(
      text
    );
    const matchField = /ПОЛИГОН: (?<field>.*)/gi.exec(text);
    const matchTime = /Построение (?<time>\d{1,2}:\d{1,2})/gi.exec(text);
    const matchRadio = /ОГР.ЧАСТОТА (?<radio>\d*.\d*)/gi.exec(text);
    const matchWay = /Как добраться:.*\n(?<way>.*)/gi.exec(text);
    const fullDate = new Date(
      `${matchDate.groups.date.split('.').reverse().join('-')}T${
        matchTime.groups.time
      }`
    );

    return {
      id,
      fullDate,
      gameType: matchDate.groups.game,
      date: matchDate.groups.date,
      time: matchTime.groups.time,
      field: matchField.groups.field.trim(),
      radio: matchRadio.groups.radio,
      wayLink: matchWay.groups.way,
      display: {
        label: matchDate[0],
        field: matchField[0].trim(),
        time: matchTime[0],
        radio: matchRadio[0],
      },
    };
  });

  const promises = [];
  parsedGames.forEach((game) => {
    promises.push(
      new Promise(async (res) => {
        const gameSnapshot = await findGame(game.id);
        const gameData = gameSnapshot.val();
        if (!gameData) {
          await saveGame(game);
          const text = Object.values(game.display).map((el) => `${el} \n`);
          const encodedText = encodeURIComponent(text);
          await sendMessage(encodedText);
        }
        res();
      })
    );
  });
  await Promise.all(promises);
}

cron.schedule('0,15,30,45 9-22 * * 3-6', () => {
  getGames();
});

// cron.schedule('* * * * *', () => {
//   getGames();
//   sendMessage('Check');
// });
