const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

// Load all command files from the commands directory
const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(`[WARNING] The command at ./commands/${file} is missing "data" or "execute".`);
    }
}

// Register the commands to the guild
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands...`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands }
        );

        console.log(`✅ Successfully reloaded application (/) commands.`);
    } catch (error) {
        console.error('❌ Error while deploying commands:', error);
    }
})();
