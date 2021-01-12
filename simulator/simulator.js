const axios = require("axios");
const { cons } = require("./assets/distribute.js");
const distribute = require("./assets/distribute.js");
const { prod } = require("./assets/production.js");
const production = require("./assets/production.js");

const backend = "http://localhost:5000/api"

let batterylimit = 2000;

let totalproduction = 0;
let totalconsumption = 0;
let totalnetproduction = 0;
let totalbuffer = 0;

const initTotal = async () => { 
  try {
    const response = await axios.get(backend + '/grid');
  if (response.status === 200) { 
    console.log('Request on api/grid worked!');
    return response.data;
  }
  } catch (err) {
   console.error(err)
  }
}

const update = async () => { 
  try {
  const response = await axios.get(backend + '/household');
  if (response.status === 200) { 
    console.log('Request on api/household worked!');
   return response.data;
  }
  } catch (err) {
   console.error(err)
  }
}

// tick = 10000 //for error checking.
tick = 1000;
setInterval(() => {

  initTotal().then(data => {
      totalproduction = 0;
      totalconsumption = 0;
      totalnetproduction = 0;
      totalbuffer = data.totalbuffer;
  });

  update().then(data => {
    distribute.distributeInit();

    var objCount = data.length;
    for ( var x = 0; x < objCount ; x++ ) {
      var curitem = data[x];
      distribute.distributeAvg();

      production.calcProd(distribute.wind);
      production.calcNetProd(distribute.cons);
      production.calcPrice(distribute.wind, distribute.cons);
      production.calcBuffer(production.netprod, curitem.ratio, curitem.buffer);
      production.checkBlackout(totalbuffer)
    
      const res = axios.put(backend + "/household/" + curitem.houseid, {
        wind: distribute.wind,
        production: production.prod,
        consumption: distribute.cons,
        netproduction: production.netprod,
        price: production.price,
        buffer: production.buffer,
        blackout: production.blackout
      });

      totalconsumption = totalconsumption + distribute.cons;
      totalproduction = totalproduction + production.prod;
      totalnetproduction = totalnetproduction + production.netprod;

      if((totalbuffer + (production.netprod * (1 - curitem.ratio))) > batterylimit) {  // 
        totalbuffer = totalbuffer
      }else{
        totalbuffer = totalbuffer + (production.netprod * (1 - curitem.ratio));
      } 
    }

    const res = axios.put(backend + "/grid", {
      totalproduction: totalproduction,
      totalconsumption: totalconsumption,
      totalnetproduction: totalnetproduction,
      totalbuffer: totalbuffer
    })
  });
}, tick);
