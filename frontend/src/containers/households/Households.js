import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { displayDatabase } from "../../actions/authActions";
import axios from 'axios';
import "./Households.css";

class Households extends Component {
    constructor() {
        super();
        this.state = {
            pollingCount: 0,
            items: [],
            delay: 1000,
            errors: {}
        };
    }
    //Sets an interval and tickrate when component and for as long as it's mounted
    componentDidMount() {
        this.interval = setInterval(this.tick, this.state.delay);
    }

    componentDidUpdate(prevProps, prevState){
        if (prevState.delay !== this.state.delay) {
            clearInterval(this.interval);
            this.interval = setInterval(this.tick, this.state.delay);
        }
    }
    //Stops ticking when the component is unmounted
    componentWillUnmount() {
        clearInterval(this.interval);
    }


    tick = async () => {    

            var kind = "household";
            const response = await axios.get("/api/" + kind);
            this.setState({
                pollingCount: this.state.pollingCount + 1,
                items: response.data
            })
    }



    render() {
         let items = this.state.items
        return(
        <div className="Apphouse">
            <h1>Households</h1>
            <h2>Refreshes: {this.state.pollingCount}</h2>
            {/* Fetch data from API */}
            <br />
            {/* Display data from API */}
            <div className="houses">   
            {items.map(item =>
                <div className="house" key={item.id}>
                    <h2>ID: {item.id}</h2>
                    <div className="details">
                        <img
                        src={"data:image/png;base64," + item.img}
                        alt='Look here'/>
                        <br/>
                        <p><b> Wind: </b>{item.wind} m/s</p>
                        <p><b>Production: </b>{item.production} kW/h</p>
                        <p><b>Consumption: </b>{item.consumption} kW/h</p>
                        <p><b>Netto production: </b>{item.netproduction} kW/h</p>
                        <p><b>Buffer: </b>{item.buffer} kW</p>
                        <p><b>Current market price:</b>{item.price} sek/kW </p>
                        <p><b>Blackout: </b>{String(item.blackout)}</p>
                        <p><b>Prosumer: </b>{String(item.isproducing)}</p>
                        <p><b>Ratio: </b>{item.ratio}</p>
                    </div>
                </div>
            )}
            
            </div>
        </div>   
        );
    }
}

Households.propTypes = {
    displayDatabase: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });
  export default connect(
    mapStateToProps,
    { displayDatabase }
  )( Households );