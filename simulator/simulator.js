const axios = require("axios");
const { cons } = require("./assets/distribute.js");
const distribute = require("./assets/distribute.js");
const { prod, netprodmarket, ratio } = require("./assets/production.js");
const production = require("./assets/production.js");

const backend = "http://localhost:5000/api";

let init = false;

let batterylimit_h = 100;
let batterylimit_t = 2000;

let totalproduction = 0;
let totalconsumption = 0;
let totalnetproduction = 0;
let totalbuffer = 0;

let managerpower = 0;

let totalprice = 0;
let totalmodelprice = 0;

const initTotal = async () => { 
  try {
    const response = await axios.get(backend + '/grid/');
  if (response.status === 200) { 
    //console.log('Request on api/grid worked!');
    return response.data;
  }
  } catch (err) {
   console.error(err)
  }
}

const updateUser = async () => { 
  try {
  const response = await axios.get(backend + '/household/');
  if (response.status === 200) { 
    //console.log('Request on api/household worked!');
   return response.data;
  }
  } catch (err) {
   console.error(err)
  }
}

const updateManager = async () => { 
   try {
   const response = await axios.get(backend + '/manager/');
   if (response.status === 200) { 
     //console.log('Request on api/household worked!');
    return response.data;
   }
   } catch (err) {
    console.error(err)
   }
 }

// tick = 10000 //for error checking.
tick = 1000;
setInterval(() => {
    initTotal().then(tot => {
      if(!init){
         totalproduction = tot.totalproduction;
         totalconsumption = tot.totalconsumption;
         totalnetproduction = tot.totalnetproduction;
         totalmodelprice = tot.modelprice;
         totalbuffer = tot.buffer;
      }

      totalprice = tot.price;
   });

   /*
      CHARGE BUFFER WITH RATIO * PRODUCTION OF MANAGER
      REST IS SENT TO MARKET
   */

   updateManager().then(manager => {
      var objCount = manager.length;
      for ( var x = 0; x < objCount ; x++ ) {
         var curitem = manager[x];

         if(curitem.status === "running"){
            if(totalbuffer + (curitem.production * curitem.ratio) >= batterylimit_t){
               totalbuffer = batterylimit_t;
               managerpower = managerpower + ((totalbuffer + (curitem.production * curitem.ratio)) - batterylimit_t);
            }else if(totalbuffer + (curitem.production * ratio) < 0){
               totalbuffer = 0;
               managerpower = managerpower + (curitem.production * (1 - curitem.ratio));
            }else{
               managerpower = managerpower + (curitem.production * (1 - curitem.ratio));
               totalbuffer = totalbuffer + (curitem.production * curitem.ratio);
            }
         }
      }
   })

   distribute.distributeInit();

   /*
      CHARGE HOUSE BUFFER (NETPRODUCTION * RATIO)
      REST IS SENT TO MARKET (NETPRODUCTION * (1 - RATIO))

      TOTALPRODUCTION - TOTALCONSUMPTION != TOTALNETPRODUCTION.
      REMEBER TO TAKE THE RATIO IN ACCOUNT!
   */

   updateUser().then(data => {
      var objCount = data.length;
      for ( var x = 0; x < objCount ; x++ ) {
         var curitem = data[x];

         distribute.distributeAvg();

         if(curitem.isproducing){
            production.calcProd(distribute.wind);
         }else if(!curitem.isproducing){
            production.calcProd(0);
         }

         production.setRatio(curitem.ratio);
         production.calcNetProd(distribute.cons);
         production.calcBuffer(curitem.buffer, batterylimit_h);
         production.checkBlackout(totalbuffer, totalnetproduction + managerpower);

         const res = axios.put(backend + "/household/" + curitem.id, {
            wind: ""+ distribute.wind,
            production: "" + production.prod,
            consumption: "" + distribute.cons,
            netproduction: "" + production.netprodmarket,
            price: "" + totalprice,
            buffer: "" + production.buffer,
            blackout: "" + production.blackout
         });

         if(!init){ // Init the total sum or add the difference depending on first iteration or not. 
            totalconsumption = (totalconsumption + distribute.cons);
            totalproduction = (totalproduction + production.prod);
            totalnetproduction = (totalnetproduction + production.netprodmarket);
         }else{
            totalconsumption = (totalconsumption + (distribute.cons - curitem.consumption));
            totalproduction = (totalproduction + (production.prod - curitem.production));
            totalnetproduction = (totalnetproduction + (production.netprodmarket - curitem.netproduction));
         }

         if((totalbuffer + (production.netprod * (1 - curitem.ratio))) > batterylimit_t) {  
            totalbuffer = batterylimit_t
         }else if(production.netprod < 0){
            if((totalbuffer + (production.netprod * (1 - curitem.ratio))) < 0){
               totalbuffer = 0;
            }else{
               totalbuffer = totalbuffer + (production.netprod * (1 - curitem.ratio));
         } 
         }
      }
   });

   if(totalnetproduction < 0){
      totalmodelprice = 10 + (-0.1 * totalnetproduction); // Fix (without any dist.)
   }else{
      totalmodelprice =  10 - (0.1 * totalnetproduction); 
   }

   const res = axios.put(backend + "/grid/", {
      totalproduction: "" + (totalproduction + managerpower),
      totalconsumption: "" + (totalconsumption),
      totalnetproduction: "" + (totalnetproduction + managerpower),
      buffer: "" + totalbuffer,
      modelprice: "" + totalmodelprice
   })

   managerpower = 0;
   init = true;
}, tick);