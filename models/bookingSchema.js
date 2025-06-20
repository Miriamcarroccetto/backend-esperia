import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    experience: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Experience',
        required: true
    },
    bookingDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    message: {type: String, default: ""}
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;