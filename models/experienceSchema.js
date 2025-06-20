import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema ({
    title: {type: String, required: true},
    category: {type: String, required: true,
        enum: [
            "natura-e-avventura",
            "benessere-e-relax",
            "eventi-e-spettacoli",
            "avventure-urbane",
           
        ]
    },
    description: {type: String, required: true},
    city: {type: String, required: true},
    price: {type: Number, required: true},
    duration: {
        type: new mongoose.Schema ({
            value: {type: Number, required: true},
            unit: {type: String, required: true}
        }),
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {type: [Date], required: true},
    image: {type: String}
 
});

const Experience = mongoose.model ('Experience', experienceSchema);
export default Experience;


