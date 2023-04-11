const express    = require('express')
const app        = express();
const path       = require('path')
const { engine } = require('express-handlebars')
const db         = require('./db/connection')
const bodyParser = require('body-parser')
const Job        = require('./models/Job')
const Sequelize  = require('sequelize')
const Op         = Sequelize.Op

const PORT = 3000;

//body parse
app.use(bodyParser.urlencoded({ extended: false }))

// handlebars
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

//static folder
app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, function (req, res) {
    console.log(`O servidor esta funcionando na porta ${PORT}`)
})
//db connection
db.authenticate()
    .then(() => {
        console.log('Conectou com o banco')
    }).catch((err) => {
        console.log(`Ocorreu um erro ao conectar ${err}`)
    })

// routes 
app.get('/', function (req, res) {

    let search = req.query.job
    let query = '%'+search+'%'

    if (!search) {
        Job.findAll({order: [
            ['createdAt', 'ASC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs
            })
        }) 
        .catch(err => console.log(err))
    } else {
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [
            ['createdAt', 'ASC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs, search
            })
        })
        .catch(err => console.log(err)) 
    }


})

//jobs routes
app.use('/jobs', require('./routes/jobs'))