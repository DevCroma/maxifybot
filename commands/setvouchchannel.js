const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '../data/vouch-settings.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setvouchchannel')
        .setDescription('Set the channel where vouches will be sent')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to send vouches to')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        let data = {};
        if (fs.existsSync(dbPath)) {
            data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        }
        data[interaction.guild.id] = channel.id;
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        await interaction.reply({ content: `✅ Vouch channel set to <#${channel.id}>`, ephemeral: true });
    }
};
