const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: '❌ There was an error executing this command.',
                    ephemeral: true
                });
            }
        }

        if (interaction.isModalSubmit() && interaction.customId === 'vouchModal') {
            const stars = interaction.fields.getTextInputValue('stars');
            const item = interaction.fields.getTextInputValue('item');
            const extra = interaction.fields.getTextInputValue('extra') || 'None';
            const proof = interaction.fields.getTextInputValue('proof') || 'None';

            const dbPath = path.join(__dirname, 'data', 'vouch-settings.json');
            let vouchData = {};
            if (fs.existsSync(dbPath)) {
                vouchData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            }

            const vouchChannelId = vouchData[interaction.guild.id];
            const vouchChannel = interaction.guild.channels.cache.get(vouchChannelId);

            if (!vouchChannel) {
                return interaction.reply({
                    content: '❌ Vouch channel not set. Please ask an admin to run `/setvouchchannel`.',
                    ephemeral: true
                });
            }

            const starCount = Math.min(Math.max(parseInt(stars), 1), 5);
            const starsDisplay = '⭐'.repeat(starCount);

            const embed = new EmbedBuilder()
                .setTitle('Maxify.gg Vouches')
                .setColor('#FCD34D')
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Rating', value: `${starsDisplay}`, inline: true },
                    { name: 'Vouch:', value: `${extra}`, inline: false },
                    { name: 'Vouch N°:', value: `\`#${Math.floor(Math.random() * 1000)}\``, inline: true },
                    { name: 'Vouched by:', value: `<@${interaction.user.id}>`, inline: true },
                    { name: 'Vouched at:', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                    { name: 'Image/Video Proof:', value: proof }
                )
                .setFooter({ text: 'https://discord.gg/maxify • Maxify.gg' })
                .setTimestamp();

            await vouchChannel.send({ embeds: [embed] });
            await interaction.reply({ content: '✅ Your vouch was submitted!', ephemeral: true });
        }
    });
};
