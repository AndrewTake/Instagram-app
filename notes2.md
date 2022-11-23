for milestone 2 
we will use http js
favicon.icon is the photo next to url name
starter code has a smarter verison of the webserver

to start cd into source dir and then run node index.js
or
node src/index.js
this will start server 

node form code on github is answer to one of the questions

const http = require('http')

const requestListener = function(req,res){
    if (req.url == "/contact"){
    res.end(<h1>"Contact World</h1>)
    }else{
    res.writeHead(200)
    }
}

const server = http.createServer(requestListener)
server.listen(8080, () => {
    console.log("the server has started)
})