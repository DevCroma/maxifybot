
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calcvalue')
        .setDescription('Multiply a value by 0.6')
        .addNumberOption(option =>
            option.setName('value')
                .setDescription('The number you want to multiply')
                .setRequired(true)),

    async execute(interaction) {
        const value = interaction.options.getNumber('value');
        const result = value * 0.6;
        await interaction.reply(`✅ ${value} × 0.6 = **${result.toFixed(3)}**`);
    }
};
