import { config } from 'dotenv';
import { Client, Routes } from 'discord.js';    
import { REST } from '@discordjs/rest';
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { readFileSync } from 'fs';

import { LSPD_Roles } from './Enum/LSPD_Roles.js';
import { Console } from 'console';

config();

const TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const SHEET_ID = process.env.SHEET_ID;
const CREDENTIALS = JSON.parse(readFileSync('sheets_creds.json'));

const doc = new GoogleSpreadsheet(SHEET_ID);
await doc.useServiceAccountAuth({
    // env var values are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    client_email: CREDENTIALS.client_email,
    private_key: CREDENTIALS.private_key,
});

const client = new Client({intents: ['Guilds', 'GuildMessages']});

const rest = new REST({version: '10'}).setToken(TOKEN);

client.login(TOKEN);

client.on('ready', ()  => {
    console.log('Salary Bot by Sinaps is ON and ready to use!')
})

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'register_employee') {
            const name = interaction.options.get('nom').member.nickname;
            const grade = interaction.options.get('grade').value;
            // console.log(interaction.options.get('grade'))
            await doc.loadInfo(); // loads document properties and worksheets
            const sheet = doc.sheetsByIndex[0];
            await sheet.addRow({'Nom + Prénom': name, 'Heures travaillées': 0, 'Grade': grade, 'Salaire': '0$'});
            interaction.reply({content: 'Employée enregistrée avec succès!'});
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