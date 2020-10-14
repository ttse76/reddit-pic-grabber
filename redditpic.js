const Discord = require('discord.js');
const fetch = require('node-fetch');
const{
    token
} = require('./config.json');

const client = new Discord.Client();
client.login(token);

client.once('ready', () => {
    console.log('Ready!');
});
