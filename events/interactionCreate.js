const fs = require('fs');
const path = require('path');
const { Events, EmbedBuilder } = require('discord.js');
const dbPath = path.join(__dirname, '../data/vouch-settings.json');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.isModalSubmit() && interaction.customId === 'vouchModal') {
            const stars = interaction.fields.getTextInputValue('stars');
            const item = interaction.fields.getTextInputValue('item');
            const extra = interaction.fields.getTextInputValue('extra') || 'None';
            const proof = interaction.fields.getTextInputValue('proof') || 'None';

            const embed = new EmbedBuilder()
                .setTitle('⭐ New Vouch Submitted')
                .addFields(
                    { name: 'User', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Stars', value: stars, inline: true },
                    { name: 'Item Bought', value: item, inline: true },
                    { name: 'Extra Info', value: extra },
                    { name: 'Proof', value: proof }
                )
                .setColor('#00FF00')
                .setTimestamp();

            let channelId;
            if (fs.existsSync(dbPath)) {
                const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
                channelId = data[interaction.guild.id];
            }

            if (channelId) {
                const channel = await interaction.guild.channels.fetch(channelId);
                if (channel) {
                    await channel.send({ embeds: [embed] });
                    await interaction.reply({ content: '✅ Vouch submitted!', ephemeral: true });
                } else {
                    await interaction.reply({ content: '❌ Vouch channel not found!', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: '❌ Vouch channel not set. Use /setvouchchannel.', ephemeral: true });
            }
        }
    }
}
