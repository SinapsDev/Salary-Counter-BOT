import { config } from 'dotenv';
import { Client, Routes } from 'discord.js';    
import { REST } from '@discordjs/rest';
import { GoogleSpreadsheet } from 'google-spreadsheet'

import { LSPD_Roles } from './Enum/LSPD_Roles.js';

config();

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const SHEET_ID = process.env.SHEET_ID

const client = new Client({intents: ['Guilds', 'GuildMessages']});

const rest = new REST({version: '10'}).setToken(TOKEN);

client.login(TOKEN);

client.on('ready', ()  => {
    console.log('Salary Bot by Sinaps is ON and ready to use!')
})

client.on('interactionCreate', (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'register_employee') {
            console.log(interaction.options.get('nom'))
            interaction.reply({content: 'Hey'});
        }
    }
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
        },
        {
            name: 'register_employee',
            description: 'Enregistrer un nouveau employée dans la base de donnée du bot.',
            options: [
                {name: 'nom', description: 'Nom de l\'employée.', type: 6, required: true},
                {name: 'grade', description: 'Grade de l\'employée.', type: 3, required: true, choices: LSPD_Roles},
            ]
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