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

const sources = [];
const prefixes = ['https://i.imgur.com', 'https.i.redd.it'];

client.on('message', message => {
    const args = message.content.trim().split(' ');
    const command = args.shift().toLowerCase();
    if(command != 'redditpic') return;

    if(command === 'redditpic' && args.length > 0){
        let arg = args[0].toLowerCase();

         if(arg === 'add'){
             addNew(args[1]);
             return;
         }

         if(arg === 'remove'){
            remove(args[1]);
            return;
         }

         if(arg === 'sources'){
             if(sources.length < 1){
                 message.channel.send('No sources');
                 return;
             }
            let out = 'Current sources:\n';
            let flag = false;
            for(source in sources){
                if(flag){
                    out += ', ';
                }
                out += sources[source];
                flag = true;
            }
            message.channel.send(out);
            return;
         }
    }

    function addNew(subreddit){
        var url = 'https://www.reddit.com/r/' + subreddit + '/top.json';
        if(sources.includes(subreddit.toLowerCase())){
            message.channel.send('r/' + subreddit + ' is already a source');
            return;
        }
        fetch(url).then(res => res.json()).then(json => {
            if(json.data.children.length == 0){
                message.channel.send('r/' + subreddit + " does not exist");
                return;
            }
            else{
                sources.push(subreddit.toLowerCase());
                message.channel.send('r/' + subreddit + ' added to sources');
            }
        });
    }

    function remove(subreddit){
        var index = sources.indexOf(subreddit.toLowerCase());
        if(index < 0){
            message.channel.send('r/' + subreddit + ' is not a source');
            return;
        }
        sources.splice(index, 1);
        message.channel.send('r/' + subreddit + ' removed');

    }

    if(sources.length == 0){
        message.channel.send('You need at least one subreddit source');
        return;
    }
});
