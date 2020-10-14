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
const prefixes = ['https://i.imgur.com', 'https://i.redd.it'];
const urlSuffix = ['hot.json?', 'top.json?'];
const timing = ['day', 'month', 'year', 'all'];

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
    
    //Helper functions for arg commands
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

    //Check to see if there are any listed sources
    if(sources.length == 0){
        message.channel.send('You need at least one subreddit source');
        return;
    }

    var url = 'https://www.reddit.com/r/' + sources[Math.floor(Math.random() * sources.length)] + '/' + urlSuffix[Math.floor(Math.random() * urlSuffix.length)] + 't=' + timing[Math.floor(Math.random() * timing.length)];
    var settings = { method:'Get' };
    fetch(url, settings).then(res => res.json()).then(jsonData => {
        let arr = [];
        let subData = jsonData.data.children;
        for(let i = 0; i < subData.length; i++){
            let obj = subData[i];
            let imgUrl = obj.data.url;
            let prefixGood = checkPrefix(imgUrl);
            if(!imgUrl.includes('gif') && checkPrefix(imgUrl)){
                arr.push(imgUrl);
            }
        }
        if(arr.length == 0){
            message.channel.send('No pictures found');
            return;
        }
        message.channel.send({
            files:[arr[Math.floor(Math.random() * arr.length)]]
        });
    }).catch(function(err){
        console.log(err);
        message.channel.send('there was an error fetching data');
    });

    function checkPrefix(imgUrl){
        for(prefix in prefixes){
            if(imgUrl.startsWith(prefixes[prefix])){
                return true;
            }
        }
        return false;
    }

});
