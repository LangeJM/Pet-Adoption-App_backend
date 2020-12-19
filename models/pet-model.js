const Schema = mongoose.Schema

const Pet = new Schema(
    {
        name: { type: String, required: true },
        status: { type: String, required: true }, // fostered, adopted, available
        type: { type: String, required: true }, // type in mongodb syntax will resolve to 'string' that is why we have to wrap the  
        breed: { type: String, required: true},
        height: { type: number, required: true },
        weight: { type: number, required: true },
        color: { type: String, required: true },
        hypoallergenic: { type: Boolean, required: true },
        dietaryRestrictions: { type: String, required: true },
        fosteredBy: { type: String, required },
        savedBy: { type: [String], required}
        // lastName: { type: [String], required: true }, // inc ase of multiple entries in array
    },
    { timestamps: true },
)

module.exports = mongoose.model('pets', Pet)