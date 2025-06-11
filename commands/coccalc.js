const fs = require('fs');
const path = require('path');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const TH_VALUES = {
    th10: 0.5,
    th11: 1.0,
    th12: 1.5,
    th13: 2.0,
    th14: 3.0,
    th15: 4.0,
    th16: 5.0,
    th17: 8.0,
};

const PRICING_TIERS = [
    { max: 50, rate: 0.085 },
    { max: 100, rate: 0.075 },
    { max: 500, rate: 0.065 },
    { max: 1000, rate: 0.055 },
];

function getRate(total) {
    for (const tier of PRICING_TIERS) {
        if (total <= tier.max) return tier.rate;
    }
    return PRICING_TIERS[PRICING_TIERS.length - 1].rate;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coccalc')
        .setDescription('Calculate wall cost by town hall')
        .addStringOption(option =>
            option.setName('townhall')
                .setDescription('Town Hall level')
                .setRequired(true)
                .addChoices(
                    { name: 'TH10', value: 'th10' },
                    { name: 'TH11', value: 'th11' },
                    { name: 'TH12', value: 'th12' },
                    { name: 'TH13', value: 'th13' },
                    { name: 'TH14', value: 'th14' },
                    { name: 'TH15', value: 'th15' },
                    { name: 'TH16', value: 'th16' },
                    { name: 'TH17', value: 'th17' }
                ))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('How many walls?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('goldpass')
                .setDescription('Do you have Gold Pass?')
                .setRequired(true)
                .addChoices(
                    { name: 'Yes', value: 'yes' },
                    { name: 'No', value: 'no' }
                )),

    async execute(interaction) {
        const townhall = interaction.options.getString('townhall');
        const amount = interaction.options.getInteger('amount');
        const goldPass = interaction.options.getString('goldpass');

        const perWall = TH_VALUES[townhall];
        const totalMil = perWall * amount;
        const rate = getRate(totalMil);
        let totalPrice = totalMil * rate;

        let discountNote = 'No';
        if (goldPass === 'yes') {
            totalPrice *= 0.95; // Apply 5% discount
            discountNote = '✅ Yes (5% Discount Applied)';
        } else {
            discountNote = '❌ No';
        }

        const embed = new EmbedBuilder()
            .setTitle('📊 Wall Upgrade Cost Calculator')
            .setColor('#00AAFF')
            .addFields(
                { name: '<:Townhall:1382434001234690119> Town Hall', value: `\`${townhall.toUpperCase()}\``, inline: true },
                { name: '🧱 Walls', value: `\`${amount}\``, inline: true },
                { name: '<:resources:1382432269486002176> Resource Cost', value: `\`${totalMil.toFixed(2)}M\``, inline: true },
                { name: '💵 Rate Applied', value: `\`$${rate.toFixed(3)}/M\``, inline: true },
                { name: '<:Goldpass:1382432629999013929> Gold Pass', value: discountNote, inline: true },
                { name: '💸 Total Price', value: `\`$${totalPrice.toFixed(2)}\``, inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    }
};
