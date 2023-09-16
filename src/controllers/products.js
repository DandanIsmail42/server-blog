exports.createProduct = (req, res, next) => {
    const name = req.body.name
    const price = req.body.price
    res.json({
        message : 'Data succesfully',
        data: {
            id: 3,
            name: name,
            price: price
        }
    })
    next()
}

exports.getAllProducts = (req, res, next) => {
    res.json({
        message: 'Get All'
    })
    next()
}