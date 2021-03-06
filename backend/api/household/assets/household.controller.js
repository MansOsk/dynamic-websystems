const mongoose = require('mongoose');
const Household = require('./household.model');

// Load input validation
const validateUpdateInput = require("./validation/updatedb");
    
/* WORKING 

    IN: {}

    OUT:

    {
        "_id": "5ff320840093be7ddc72cb1a",
        "houseid": "5ff320840093be7ddc72cb18",
        "address": "ha123",
        "wind": 0,
        "consumption": 0,
        "price": 0,
        "isproducing": true,
        "production": 0,
        "netproduction": 0,
        "buffer": 0,
        "ratio": 0.5,
        "createdAt": "2021-01-04T14:04:52.406Z",
        "updatedAt": "2021-01-04T14:04:52.406Z",
        "__v": 0
    }

*/
exports.getHouses = function(req, res) {
    Household.find(function (err, house) {
        if (err){
            console.log(err);
        }
        else{
            res.json(house);
        }
    });
}

/*  WORKING

    IN: 

    {
    "address": "klintvägen 11",
    "wind": 10,
    "consumption": 3,
    "price": 2,
    "production": 5,
    "netproduction": 6,
    "buffer": 0
    }

    OUT:

    "Household added!"
*/
exports.addHouse = function(req, res) {
    const id = new mongoose.mongo.ObjectId();
    const address = req.body.address;

    const wind = req.body.wind;
    const production = req.body.production;
    const consumption = req.body.consumption;
    const netproduction = req.body.netproduction;
    const price = 0;
    
    const ratio = 0; 
    const buffer = req.body.buffer;
    const isproducing = false;
    const blackout = false;
    const img = "";

    const newHousehold = new Household({
        id,
        address,
        wind,
        production,
        consumption,
        netproduction,
        price,
        ratio,
        buffer,
        isproducing,
        blackout,
        img
    });

    newHousehold.save()
        .then(() => res.json('Household added!'))
        .catch(err => res.status(400).json('Error: ' + err));
};

/* WORKING

    IN: http://130.240.200.62:3000/api/household/5ff320840093be7ddc72cb18

    OUT: 
    
    {
    "_id": "5ff320840093be7ddc72cb1a",
    "houseid": "5ff320840093be7ddc72cb18",
    "address": "ha123",
    "wind": 0,
    "consumption": 0,
    "price": 0,
    "isproducing": true,
    "production": 0,
    "netproduction": 0,
    "buffer": 0,
    "ratio": 0.5,
    "createdAt": "2021-01-04T14:04:52.406Z",
    "updatedAt": "2021-01-04T14:04:52.406Z",
    "__v": 0
}

*/
exports.getHouse = function(req, res) {
    Household.findOne({ id: req.params.id}, function (err, house) {
        if (err){
            console.log(err);
        }
        else{
            res.json(house);
        }
    });
};
/*  WORKING

    IN:

    {
    "wind": "13"
    }   

    OUT:

    {
    "message": "Data Updated Successfully",
    "data": {
        "_id": "5ff320840093be7ddc72cb1a",
        "houseid": "5ff320840093be7ddc72cb18",
        "address": "ha123",
        "wind": 13,
        "consumption": 0,
        "price": 0,
        "isproducing": true,
        "production": 0,
        "netproduction": 0,
        "buffer": 0,
        "ratio": 0.5,
        "createdAt": "2021-01-04T14:04:52.406Z",
        "updatedAt": "2021-01-04T14:38:20.068Z",
        "__v": 0
    }
}

*/
exports.updateHouse = function(req, res) {
     // Form validation
    const { errors, isValid } = validateUpdateInput(req.body);
     // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Household.findOne({ id: req.params.id}, function (err, house) {
        house.wind = req.body.wind ? req.body.wind: house.wind;
        house.production = req.body.production? req.body.production: house.production;
        house.consumption = req.body.consumption? req.body.consumption: house.consumption;
        house.netproduction = req.body.netproduction? req.body.netproduction: house.netproduction;
        house.price = req.body.price? req.body.price: house.price;
        house.ratio = req.body.ratio? req.body.ratio: house.ratio;
        house.buffer = req.body.buffer? req.body.buffer: house.buffer;
        house.blackout = req.body.blackout? req.body.blackout: house.blackout;
        house.img = req.body.img? req.body.img: house.img;

        house.save(function (err) {
            if (err)
                res.json(err)
            res.json({
                message: "Data Updated Successfully",
                data: house
            });
        });

    });
};

exports.timeout = function(req, res) {
    Household.findOne({ id: req.params.id}, function (err, house) {
       actual_ratio = house.ratio;
       house.ratio = 1;
                                                        //30sec timeout
       setTimeout(function(){ reset(house,actual_ratio); }, 30000); // Delay timeout.

       house.save(function (err) {
           if (err)
               res.json(err)
           res.json({
               message: "Data Updated Successfully",
               data: house
           });
       });

   });
};

const reset = function(house, actual_ratio, res){
    house.ratio = actual_ratio;
 
    house.save(function (err) {});
}
