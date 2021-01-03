var http = require('http')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var server = http.Server(app)
var Article = require('./article.model')

var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var dbURL = 'mongodb://localhost:27017/cw10' //change this if you are using Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', function (err) {
 console.log(err)
})


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// your server routes go here
app.get('/', function(request, response){
    console.log(__dirname)
    response.sendFile(__dirname+'/index.html')
})

//add a GET route /second that resturns second.html in the response
app.get('/second', function(request, response){
    console.log(__dirname)
    response.sendFile(__dirname+'/second.html')
})

//add a GET route /form that returns second.html in the response
app.get('/article/form', function(request, response){
    response.sendFile(__dirname+'/form.html')
})
let articles = [{title: "test1", content: "test1"},
                {title: "test2", content: "test2"},
                {title: "test3", content: "test3"}]
app.post('/article/new', function (request, response){
var newArticle = new Article(request.body)
newArticle.save(function (err, data) {
if (err)
     return response.status(400).json({
       error: 'Title is missing'
     })
   return response.status(200).json({
     message: 'Article created successfully'
   })
 })


    //console.log('form data api called')
    //console.log(request.body)
    //if(request.body.title){
        //articles.push(request.body)
        //console.log(articles)
        //response.json({msg: 'Article submitted'})
    //}
    //else{
    //    response.status(400).json({error: 'Title is missing'})
    //}
    
})

app.get('/article/:id', function (request, response) {
    console.log(request.params.id)
    Article.findById(request.params.id, function (err, data) {
        response.render('article.ejs', {
          article: data
        })
      })     
    //response.render('article.ejs',{
    //    article: articles[request.params.id]
    //})
})

app.get('/articles/all', function (request, response) {
    Article.find({}, function (err, data) {
        console.log(data)
        response.render('allArticles.ejs', {
          articles: data
        })
      })
     
    
    //response.render('allArticles.ejs',{
    //    articles: articles
    //})
})

server.listen(process.env.PORT || 3000, 
process.env.IP || 'localhost', function(){
  				console.log('Server running');
})
module.exports = {app, server, mongoose}