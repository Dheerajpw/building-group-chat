const { CronJob } = require("cron");
const { Op } = require("sequelize");

const Message = require("./models/message");
const ArchivedMessage = require("./models/archivedMessage");

const archiveMessagesJob = new CronJob(
   "0 0 2 * * *",

    async () => {
        try {
            console.log("Starting message archival...");

            const oneDayAgo = new Date(
                Date.now() - 24 * 60 * 60 * 1000
            );

            const oldMessages = await Message.findAll({
                where: {
                    createdAt: {
                        [Op.lt]: oneDayAgo,
                    },
                },
            });

            if (oldMessages.length === 0) {
                console.log("No messages to archive.");
                return;
            }

            const archivedMessages = oldMessages.map((msg) => ({
                userId: msg.userId,
                message: msg.message,
                mediaUrl: msg.mediaUrl,
                mediaType: msg.mediaType,
                createdAt: msg.createdAt,
                updatedAt: msg.updatedAt,
            }));

            await ArchivedMessage.bulkCreate(archivedMessages);

            await Message.destroy({
                where: {
                    createdAt: {
                        [Op.lt]: oneDayAgo,
                    },
                },
            });

            console.log(
                `${oldMessages.length} messages archived successfully.`
            );

        } catch (error) {
            console.error(
                "Message archival failed:",
                error
            );
        }
    },

    null,
    true,
    "Asia/Kolkata"
);

module.exports = archiveMessagesJob;