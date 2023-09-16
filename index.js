const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')

const app = express()
const productRoutes = require('./src/routes/products')
const authRoutes = require('./src/routes/auth')
const blogRoutes = require('./src/routes/blog')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        // Atur nama file dengan tanggal unik ditambahkan dengan ekstensi asli
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
      }
    
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
            cb(null, true)
        } else{
            cb(null, false)
        }
}

app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next();
  });
app.use('/v1/customer', productRoutes)
app.use('/v1/auth', authRoutes)
app.use('/v1/blog', blogRoutes)

app.use((error, req, res, next) => {
    const status = error.errorStatus || 500
    const message = error.message
    const data = error.data
    res.status(status).json({message: message, data: data})
})





mongoose.connect('mongodb+srv://dismail065:s45aK5uECeWTDmbc@cluster0.lmdxzhf.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => {
    app.listen(5000, () => console.log('Success connext database'))
})
.catch(err => console.log(err)) 

