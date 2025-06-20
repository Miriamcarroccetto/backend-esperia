const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

       console.error(`Errore (${statusCode}):`, err.message)

    res.status(statusCode).json({
        error: {
            message: err.message || 'Errore del server',
            status: statusCode,
            
        }
    })
}

export default errorHandler