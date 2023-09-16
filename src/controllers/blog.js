const {validationResult} = require('express-validator')
const path = require('path')
const fs = require('fs')
const BlogPost = require('../models/blog')

exports.createBlog = (req, res, next) => {
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){
       const err = new Error('Invalid Value')
       err.errorStatus = 400
       err.data = errors.array()
       throw err
    }

    if(!req.file){
        const err = new Error('Image harus di upload')
        err.errorStatus = 422
        throw err
    }

    const title = req.body.title
    const image = req.file.path
    const body = req.body.body


    const Posting = new BlogPost({
        title: title,
        body: body,
        image: image,
        author: {uid: 2, name: 'Maman Suratman'}
    })

    Posting.save()
    .then(result => {
    res.status(201).json(result)
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getAllBlogPost = (req, res, next) => {
    const currentPage = req.query.page || 1
    const perPage = req.query.perPage || 5
    let totalItems

    BlogPost.find()
    .countDocuments()
    .then(count => {
        totalItems = count
        return BlogPost.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
    })
    .then(result => {
        res.status(200).json({
            message: 'Get Data Sucessfully',
            data: result,
            total_data: totalItems,
            per_page: perPage,
            current_page: currentPage,
        })
    })
    .catch(err => {
        next(err)
    })

    BlogPost.find()
    
    .catch(err => {
        next(err)
    })
}

exports.getBlogPostById = (req, res, next) => {
    const postId = req.params.postId
     BlogPost.findById(postId)
    .then(result => {
       if(!result){
        const error = new Error('Blog posst tidak ditemukan')
        error.errorStatus = 404
        throw error
       }
       res.status(200).json({
        message: 'Data Berhasil dipanggil',
        data: result
       })
    })
    .catch(err => {
        next(err)
    })
}

exports.updateBlogPost = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
       const err = new Error('Invalid Value')
       err.errorStatus = 400
       err.data = errors.array()
       throw err
    }

    if(!req.file){
        const err = new Error('Image harus di upload')
        err.errorStatus = 422
        throw err
    }

    const title = req.body.title
    const image = req.file.path
    const body = req.body.body
    const postId = req.params.postId

    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const err = new Error('Blog post tidak ditemukan')
            err.errorStatus = 404
            throw err
        }
        post.title = title
        post.body = body
        post.image = image

        return post.save()
    })
    .then(result => {
        res.status(200).json({
            message: 'update sucess',
            data: result
        })
    })
    .catch(err => {
        next(err)
    })
}

exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId

    BlogPost.findById(postId)
    .then(post => {
        if(!post){
            const err = new Error('Blog post tidak ditemukan')
            err.errorStatus = 404
            throw err
        }
        removeImage(post.image)
        return BlogPost.findByIdAndRemove(postId)
    }).then(result => {
        res.status(200).json({
            message: 'Hapus berhasil',
            data: result,
        })
    })
    .catch(err => {
        console.log(err)
    })
}

const removeImage = (filePath) => {
    console.log('filepath',  filePath)
    console.log('dirname', __dirname)

    filePath = path.join(__dirname, '../..', filePath)
    fs.unlink(filePath, err => console.log(err))
}