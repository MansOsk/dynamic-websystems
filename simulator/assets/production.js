const { cons } = require("./distribute");

class Production{
    prod;
    price;
    netprod;

    calcProd(wind){
        //if the wind is less than about 25% of max
        if (wind < 4.0){ 
            this.prod = 0.0;
        }else{
            this.prod = (wind * 3.2);  
        }
    }
    
    calcPrice(wind, consumption){
        if(wind < 1.0){
            this.price = 4.0;
        } else if(1.0 < wind < 2.0){
            this.price = 3.0;
        } else if(2.0 < wind < 3.0){
            this.price = 2.0;
        } else {
            this.price = 1.0;
        }

        if(consumption < 8.0){
            this.price = this.price*0.3;
        } else if(consumption < 12.0 && consumption > 8.0) {
            this.price = this.price*0.4;
        } else if(consumption < 15.0 && consumption > 12.0){
            this.price = this.price*0.5;
        } else {
            this.price = this.price*0.6;
        }
    }

    calcNetProd(consumption){
        this.netprod = this.prod - consumption;
    }
}
module.exports = new Production();

