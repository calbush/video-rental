#! /usr/bin/env node

const userArgs = process.argv.slice(2)

const async = require('async')
const Film = require('./models/film')
const Director = require('./models/director')
const Genre = require('./models/genre')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const mongoDB = userArgs[0]

main().catch(err => console.log(err))
async function main() {
    await mongoose.connect(mongoDB)
}

const films = []
const genres = []
const directors = []

function directorCreate(first_name, last_name, country, cb){
    directorDetail = { first_name: first_name, last_name: last_name, country: country }
    const director = new Director(directorDetail)

    director.save(function (err){
        if (err){
            cb(err, null)
            return
        }
        console.log('New Director: ' + director)
        directors.push(director)
        cb(null, director)
    })
}

function genreCreate(name, cb){
    const genre = new Genre({ name: name })

    genre.save(function (err){
        if (err){
        cb(err, null)
        return
        }
    console.log('New Genre: ' + genre)
    genres.push(genre)
    cb(null, genre)
    })  
}

function filmCreate(title, director, year, logline, genre, cb){
    filmDetail = {
        title: title,
        director: director,
        year: year,
        logline: logline,
        genre: genre
    }

    const film = new Film(filmDetail)
    film.save(function(err){
        if(err){
            cb(err, null)
            return
        }
        console.log('New Film: ' + film)
        films.push(film)
        cb(null, film)
    })
}

function createGenreDirectors(cb){
    async.series([
        function(callback){
            directorCreate('Ingmar', 'Bergman', 'Sweden', callback)
        },
        function(callback){
            directorCreate('Akira', 'Kurosawa', 'Japan', callback)
        },
        function(callback){
            directorCreate('Krzysztof', 'Kieślowski', 'Poland', callback)
        },
        function(callback){
            directorCreate('Claire', 'Denis', 'France', callback)
        },
        function(callback){
            directorCreate('Kelly', 'Reichardt', 'United States', callback)
        },
        function(callback){
            genreCreate('Drama', callback)
        },
        function(callback){
            genreCreate('Horror', callback)
        },
        function(callback){
            genreCreate('Comedy', callback)
        },
        function(callback){
            genreCreate('Thriller', callback)
        },
        function(callback){
            genreCreate('Science Fiction', callback)
        },
        function(callback){
            genreCreate('Fantasy', callback)
        },
        function(callback){
            genreCreate('Western', callback)
        }
    ],cb)
}

function createFilms(cb){
    async.parallel([
        function(callback){
            filmCreate('The Seventh Seal', [directors[0],], 1957, 'A knight returning to Sweden after the Crusades seeks answers about life, death, and the existence of God as he plays chess against the Grim Reaper during the Black Plague', [genres[0], genres[5]], callback)
        },
        function(callback){
            filmCreate('Yojimbo', [directors[1],], 1961, 'A crafty ronin comes to a town divided by two criminal gangs and decides to play them against each other to free the town.', [genres[0], genres[3]], callback)
        },
        function(callback){
            filmCreate('The Double Life of Véronique', [directors[2],], 1991, 'Two parallel stories about two identical women; one living in Poland, the other in France. They don\'t know each other, but their lives are nevertheless profoundly connected.', [genres[0]], callback)
        },
        function(callback){
            filmCreate('Beau Travail', [directors[3],], 1999, 'Foreign Legion officer, Galoup, recalls his once glorious life, leading troops in the Gulf of Dibouti', [genres[0],], callback)
        },
        function(callback){
            filmCreate('Meek\'s Cutoff', [directors[4],], 2010, 'Settlers traveling through the Oregon desert in 1845 find themselves stranded in harsh conditions.', [genres[0], genres[6],], callback)
        }
    ], cb)
}

async.series([
    createGenreDirectors,
    createFilms,
],
function(err, results){
    if(err){
        console.log('FINAL ERR: ' +err)
    }
    else {
        console.log('All done')
    }
    mongoose.connection.close();
})



