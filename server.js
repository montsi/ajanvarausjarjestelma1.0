const express = require('express');
const path = require('path');
const app = express();
const formidable = require('express-formidable');
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));

const mysql = require("mysql");
const connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'b65e4533626915',
    password: '****',
    database: 'heroku_4963eb6f0202eb8'
});

//front end route
app.use(express.static(path.join(__dirname, 'client/build')));

//Hakee kaikki hoidot
app.get('/api/hoidot', (req, res) => {
    connection.query('SELECT * from heroku_4963eb6f0202eb8.HOITO', function(err, rows, fields) {
        if (!err) {
            res.send(JSON.stringify(rows));
        } else {
            console.log('Error while performing Query(hoidot).');
        }
    });
});


app.post('/api/tyontekijat', function(req, res) {  {/* Hakee valitun hoidon perusteella mahdolliset työntekijät*/}                                     
    const hoito = req.body.hoito;
    console.log(hoito);
    connection.query('SELECT * from heroku_4963eb6f0202eb8.TYONTEKIJA WHERE hoidot LIKE ?',["%" + hoito + "%"], function(err, rows, fields) {
        if (!err) {
            res.send(JSON.stringify(rows));
            console.log(rows);  
            console.log(this.sql);
        } else {
            console.log('Error while performing Query(tyontekijat).');
        }
    });    
});
  
//ASIAKAS ja AJANVARAUS tauluihin tiedot
app.post('/api/varaus',formidable(), function(req, res) {      
    const nimi = req.fields.nimi;
    const sahkoposti = req.fields.sahkoposti;
    const puhelinnumero = req.fields.puhelinnumero;
    const hoitoID = req.fields.hoitoID;
    const tyontekijaID = req.fields.tyontekijaID;
    const aika = req.fields.aika;
    
    
    connection.query('INSERT INTO ASIAKAS (asiakkaan_nimi,puhelinnumero,sahkoposti) VALUES (?,?,?)', [nimi,puhelinnumero,sahkoposti], function(err, rows, fields) {
        if (!err) {
            console.log(this.sql);
        } else {
            console.log('Error while inserting asiakas');
        }
    })
    
        connection.query('INSERT INTO AJANVARAUS (hoitoID,Aika,hoidon_tekija,asiakas) VALUES (?,?,?,LAST_INSERT_ID())', [hoitoID,aika,tyontekijaID], function(err, rows, fields) {
        if (!err) {
            console.log(this.sql);
        } else {
            console.log('Error while inserting Varaus');
        }
    })
    
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });
