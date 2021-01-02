const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        expire_at: { type: Date, default: Date.now, expires: 3600 },
        userId: { type: String, required: true },
    },
    { timestamps: true },
);

const Session = mongoose.model('Session', SessionSchema)

exports.Session = Session;
