const mongoose = require('mongoose')

const Schema = mongoose.Schema

const DirectorSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, required: true, maxLength: 100 },
    country: { type: String, required: true}
})

DirectorSchema.virtual('name').get(function (){
    let fullname = ''
    if (this.first_name && this.last_name){
        fullname = `${this.first_name} , ${this.last_name}`
    }
    return fullname
})

DirectorSchema.virtual('url').get(function (){
    return `/catalog/director/${this._id}`
})

module.exports = mongoose.model('Director', DirectorSchema)