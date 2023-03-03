const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FilmSchema = new Schema({
    title: { type: String, required: true},
    director: [{ type: Schema.Types.ObjectId, ref: 'Director', required: true }],
    year: { type: Number, min: 1900, max: 2023, required: true },
    logline: { type: String, required: true },
    genre: [{ type: Schema.Types.ObjectId, ref: 'Genre'}]
})

FilmSchema.virtual('url').get(function (){
    return `/catalog/film/${this._id}`
})

module.exports = mongoose.model('Film', FilmSchema)