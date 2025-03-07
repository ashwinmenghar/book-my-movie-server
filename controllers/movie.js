const Movie = require('../models/movie')
const { validateCreateMoviePayload } = require('../lib/movie')

const handleGetAllMovies = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const LIMIT = 5;

    const skip = (page - 1) * LIMIT
    const movies = await Movie.find({}).skip(skip).limit(LIMIT)

    return res.json({ status: 'success', data: { page, movies } })
}

const handleGetMovieById = async (req, res) => {
    const id = req.params.id
    const movie = await Movie.findById(id);

    if (!movie) return res.status(404).json({ status: 'success', data: null });

    return res.json({ status: 'success', data: { movie } })

}

const handleCreateMovie = async (req, res) => {
    const safeParseResult = validateCreateMoviePayload(req.body)

    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error })
    }

    const { title, description, language } = safeParseResult.data

    try {

        const movie = await Movie.create({ title, description, language })
        return res.json({ status: 'success', data: { id: movie._id } })

    } catch (error) {
        return res.status(500).json({ status: 'error', error: 'Internal Server Error' })
    }

}

const handleDeleteMovieById = async (req, res) => {
    const id = req.params.id;
    await Movie.findByIdAndDelete(id);
    return res.json({ status: 'success', data: { deleted: true } })
}

module.exports = { handleCreateMovie, handleGetAllMovies, handleDeleteMovieById, handleGetMovieById }