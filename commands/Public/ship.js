const { MessageEmbed } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
  name: 'ship',
  description: 'Sevgi yüzdesini hesaplar',
  execute(message, args) {
    const üye = message.mentions.members.first();
    if (!üye) {
      message.channel.send('Lütfen bir üyeyi etiketleyin!');
      return;
    }

    const rastgeleÜye = message.guild.members.cache.random();
    if (!rastgeleÜye) {
      message.channel.send('Sunucuda kayıtlı üye bulunamadı!');
      return;
    }

    const sevgiYüzdesi = Math.floor(Math.random() * 100);
    const canvas = Canvas.createCanvas(400, 100);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 400, 100);

    ctx.fillStyle = '#ff69b4';
    ctx.fillRect(0, 0, sevgiYüzdesi * 4, 100);

    ctx.font = '24px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${sevgiYüzdesi}%`, 200, 50);

    const attachment = new MessageAttachment(canvas.toBuffer(), 'ship.png');

    const embed = new MessageEmbed()
      .setTitle(`Sevgi Yüzdesi: ${sevgiYüzdesi}%`)
      .setDescription(`${üye} ve ${rastgeleÜye} arasındaki sevgi yüzdesi!`)
      .setImage('attachment://ship.png')
      .setColor('#ff69b4');

    message.channel.send({ embed, files: [attachment] });
  }
};