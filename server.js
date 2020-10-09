const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();

const jsonData = fs.readFileSync(path.join(`${__dirname}/./client/src/data`, 'mydata.json'), 'utf8', (err, data) => {
    if(err) throw err;
    return data;
});

//* add a new item route
app.use('/additem', router.post('/add/item', async (req, res) => {

    const response = await req.body;
    
    if(!response.disegnation || !response.Nbr || !response['p.u']) return res.status(400).json({msg: "some data is missing"});

    try {
        const myData = JSON.parse(jsonData);
        myData.push(response);

        fs.writeFile(path.join(`${__dirname}/./client/src`, '/data', 'mydata.json'), JSON.stringify(myData), err => {
            if(err) throw err;
            console.log('new products has been added...');
        });
        
        return res.json(myData);
    } catch(err) {
        console.log(err);
    }

}));

//* update your items route
app.use('/updateitem', router.post('/update/item', async (req, res) => {

    const response = await req.body;
    
    if(!response.id) return res.status(400).json({err: "no item found to update"});

    try {
        const myData = JSON.parse(jsonData);
        const newBarcodes = response.codeBarList;

        const updatedData = [];
        const updatedBarcodeslist = [];

        myData.forEach(item => {
            if(item.id === response.id) {
                updatedData.push(response);
                updatedBarcodeslist.push(...newBarcodes);
            } else {
                updatedData.push(item);
                if(item.codeBarList instanceof Array) {
                    updatedBarcodeslist.push(...item.codeBarList);
                } else {
                    updatedBarcodeslist.push(item.codeBarList);
                }
            }
        });

        fs.writeFile(path.join(`${__dirname}/./client/src`, '/data', 'barcodes.json'), JSON.stringify(updatedBarcodeslist), err => {
            if(err) throw err;
            console.log('new barcodes has been added...');
        });

        fs.writeFile(path.join(`${__dirname}/./client/src/`, 'data', 'mydata.json'), JSON.stringify(updatedData), err => {
            if(err) throw err;
            console.log('your item has been updated...');
        });

        return res.json({msg: "item updated successfuly"});
    } catch(err) {
        console.log(err);
    }

}));

//* delete an existing item route
app.use('/deleteitem', router.post('/del/item', async (req, res) => {

    const itemId = await req.body.id;

    if(!itemId) return res.status(400).json({msg: "no id found"});

    try {
        const myData = JSON.parse(jsonData);
        const newData = myData.filter(item => item.id !== itemId);

        fs.writeFile(path.join(`${__dirname}/./client/src`, '/data', 'mydata.json'), JSON.stringify(newData), err => {
            if(err) throw err;
            console.log('item deleted...');
        });
        
        return res.json({msg: "item deleted successfuly"});
    } catch(err) {
        console.log(err);
    }

}));

const port = process.env.PORT || 4500;

app.listen(port, () => console.log(`listening on port ${port}...`));
