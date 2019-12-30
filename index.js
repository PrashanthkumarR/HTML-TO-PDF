const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const pdf = require('./public/createpdf')
const cors =  require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')))



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './invoice.html'));
});


app.post('/generatepdf', function (req, res) {
    try { 
        pdf.generatePdf().then((result)=>{
            res.send(req.headers.origin + 'invoicesample.pdf')
            
        }).catch((e) => {
            Promise.reject(e)
        })
    } 
    catch (e) {
     console.log('something went wrong' , e)
    }
});


app.listen(process.env.PORT || 3000, () => console.log('app listening on port 3000!'));