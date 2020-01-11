const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const pdf = require('./public/createpdf')
const cors =  require('cors')
const fileupload = require('./public/file-uploader')
const fs = require('fs')
process.env.PWD = process.cwd()

app.use(cors())

app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(express.static(path.join(process.env.PWD, 'publicPDF')));
//app.use(express.static(path.join(__dirname, '/public')))
app.use('files', express.static(path.join(__dirname, 'publicPDF')))



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './invoice.html'));
});

app.post('/upload' ,fileupload , function(req , res){
  try {
    const file = req.file
    if (!file) {
      const error = new Error('Please upload a file')
      error.httpStatusCode = 400
      return next(error)
    }else{
        try { 
            pdf.generatePdf(req.file.originalname).then((result)=>{
                //res.send(req.headers.origin +'/' + req.file.fieldname + '.'+ 'pdf')
                if(result){
                     let filename = req.file.originalname
                    let pathloc = path.join(__dirname ,`./publicPDF/${filename}`)
                    if (fs.existsSync(path)) {
                        fs.unlink(pathloc)
                    }
                }
            }).catch((e) => {
                Promise.reject(e)
            })
        } 
        catch (e) {
         console.log('something went wrong' , e)
        }
         res.send(file)
    }
  } catch (error) {
      res.send({err:error , message:'something went wrong'})
  }
})


app.post('/generatepdf', function (req, res) {
    try { 
        pdf.generatePdf().then((result)=>{
            res.send(req.headers.origin +'/' + 'invoicesample.pdf')
            
        }).catch((e) => {
            Promise.reject(e)
        })
    } 
    catch (e) {
     console.log('something went wrong' , e)
    }
});


app.listen(process.env.PORT || 3000, () => console.log('app listening on port 3000!'));