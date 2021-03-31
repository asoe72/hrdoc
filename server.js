const build = require("./src/build");

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// template engine
app.set('view engine', 'ejs');
app.set('views', '../view');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ 
    limit:"10mb",
    extended: false 
}));

app.post('/build', function (req, res) {
    console.log('build!!');

    build.buildBook(req.body.path, req.body.prj_name);

    res.send({
        message: 'build ok',
        data: {}
    })
});

app.listen(50000, function() {
    console.log('Server Running at http://127.0.0.1:50000');
});
