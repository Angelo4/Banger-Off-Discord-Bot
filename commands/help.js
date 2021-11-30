module.exports = {
    name: 'help',
    description: 'Returns information regarding bot commands.',
    aliases: [],
    usage: '', //expected argument usage
    args: false,
    execute(message, args, main) {
        var messageContents = 'Welcome to the greatest bot that has ever graced any Discord server.\n'
            + 'Hope y\'all are ready to bang.'

        var helpMessage = new main.MessageEmbed()
            .setDescription(messageContents)
            .setFooter('Sweet as, lesgeddit!');

        message.reply({embeds: [helpMessage]})
            .catch((err) => {
                //Look into error logging in the future
                console.log(err);
                message.reply("Sorry something went wrong while asking for help. Please try again later.");
            })
    },
};