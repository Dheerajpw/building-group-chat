
const Message = require("../models/message");

const s3 = require("../config/s3");

const {
    PutObjectCommand,
    GetObjectCommand
} = require("@aws-sdk/client-s3");

const {
    getSignedUrl
} = require("@aws-sdk/s3-request-presigner");


// =====================================================
// SEND TEXT MESSAGE
// =====================================================

const sendMessage = async (req, res) => {

    try {

        const { message } = req.body;

        if (!message || !message.trim()) {

            return res.status(400).json({
                success: false,
                message: "Message is required"
            });

        }


        const newMessage = await Message.create({

            userId: req.user.id,

            message: message.trim(),

            mediaUrl: null,

            mediaType: null

        });


        return res.status(201).json({

            success: true,

            message: "Message sent successfully",

            data: newMessage

        });


    } catch (error) {

        console.error(
            "Send Message Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Internal server error"

        });

    }

};



// =====================================================
// UPLOAD MEDIA
// =====================================================

const uploadMedia = async (req, res) => {

    try {

        // =============================================
        // CHECK FILE
        // =============================================

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "File is required"

            });

        }


        const file = req.file;


        // =============================================
        // FILE NAME
        // =============================================

        const fileName =
            `chat/${Date.now()}-${file.originalname}`;


        // =============================================
        // UPLOAD TO S3
        // =============================================

        const command =
            new PutObjectCommand({

                Bucket:
                    process.env.AWS_S3_BUCKET,

                Key:
                    fileName,

                Body:
                    file.buffer,

                ContentType:
                    file.mimetype

            });


        await s3.send(command);


        // =============================================
        // CREATE PRESIGNED URL
        // =============================================

        const getObjectCommand =
            new GetObjectCommand({

                Bucket:
                    process.env.AWS_S3_BUCKET,

                Key:
                    fileName

            });


        const mediaUrl =
            await getSignedUrl(
                s3,
                getObjectCommand,
                {
                    expiresIn: 3600
                }
            );


        // =============================================
        // SAVE MESSAGE IN DATABASE
        // =============================================

        const newMessage =
            await Message.create({

                userId:
                    req.user.id,

                message:
                    null,

                mediaUrl:
                    mediaUrl,

                mediaType:
                    file.mimetype

            });


        // =============================================
        // RESPONSE
        // =============================================

        return res.status(201).json({

            success: true,

            message:
                "Media uploaded successfully",

            data:
                newMessage

        });


    } catch (error) {

        console.error(
            "Upload Media Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Media upload failed"

        });

    }

};



// =====================================================
// GET MESSAGES
// =====================================================

const getMessages = async (req, res) => {

    try {

        const messages =
            await Message.findAll({

                order: [
                    ["createdAt", "ASC"]
                ]

            });


        // =============================================
        // GENERATE FRESH PRESIGNED URLS
        // =============================================

        const updatedMessages =
            await Promise.all(

                messages.map(
                    async (message) => {

                        const data =
                            message.toJSON();


                        // ---------------------------------
                        // ONLY MEDIA MESSAGES
                        // ---------------------------------

                        if (data.mediaUrl) {

                            try {

                                // Get original S3 key
                                const url =
                                    new URL(
                                        data.mediaUrl
                                    );


                                const key =
                                    decodeURIComponent(
                                        url.pathname.substring(1)
                                    );


                                // Create S3 command
                                const command =
                                    new GetObjectCommand({

                                        Bucket:
                                            process.env.AWS_S3_BUCKET,

                                        Key:
                                            key

                                    });


                                // Generate new URL
                                data.mediaUrl =
                                    await getSignedUrl(
                                        s3,
                                        command,
                                        {
                                            expiresIn: 3600
                                        }
                                    );

                            } catch (urlError) {

                                console.error(
                                    "Presigned URL Error:",
                                    urlError
                                );

                            }

                        }


                        return data;

                    }
                )

            );


        return res.status(200).json({

            success: true,

            data:
                updatedMessages

        });


    } catch (error) {

        console.error(
            "Get Messages Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }

};



// =====================================================
// EXPORT
// =====================================================

module.exports = {

    sendMessage,

    uploadMedia,

    getMessages

};
