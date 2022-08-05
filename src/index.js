import { config } from 'dotenv';
import { Client, Routes } from 'discord.js';    
import { REST } from '@discordjs/rest';

config();

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({intents: ['Guilds', 'GuildMessages']});

const rest = new REST({version: '10'}).setToken(TOKEN);

client.login(TOKEN);

client.on('ready', ()  => {
    console.log('Salary Bot by Sinaps is ON and ready to use!')
})

async function main() {
    const commands = [
        {
            name: 'duty_on',
            description: 'Prenez votre service avec cette commande.'
        },
        {
            name: 'duty_off',
            description: 'Vous déposez votre service avec cette commande.'
        }
    ]

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands
        })
    } catch (err) {
        console.log(err)
    }
}

main();