const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Submit a vouch with star rating and details'),

    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('vouchModal')
            .setTitle('Submit a Vouch');

        const starsInput = new TextInputBuilder()
            .setCustomId('stars')
            .setLabel('How many stars? (1-5)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const itemInput = new TextInputBuilder()
            .setCustomId('item')
            .setLabel('What did you buy?')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const extraInput = new TextInputBuilder()
            .setCustomId('extra')
            .setLabel('Extra info (optional)')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        const proofInput = new TextInputBuilder()
            .setCustomId('proof')
            .setLabel('Proof (image/video URL)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(starsInput),
            new ActionRowBuilder().addComponents(itemInput),
            new ActionRowBuilder().addComponents(extraInput),
            new ActionRowBuilder().addComponents(proofInput)
        );

        await interaction.showModal(modal);
    }
};
