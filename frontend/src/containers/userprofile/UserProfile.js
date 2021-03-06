import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { displayDatabase } from "../../actions/authActions";
import axios from 'axios';
import "./UserProfile.css";

class UserProfile extends Component {
    constructor() {
        super();
        this.state = {
            pollingCount: 0,
            delay: 1000,     //tick delay
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
            const { user } = this.props.auth;
            const data = user.id

            var kind = "";
            if (user.role==="manager"){
                kind = "manager/";
            }else if (user.role==="user"){
                kind = "household/";
            }
            const response = await axios.get("/api/" + kind + data);
            this.setState({
                pollingCount: this.state.pollingCount + 1,
                id: response.data.id,
                display:  response.data.img,
                price: response.data.price,
                wind:  response.data.wind,
                production:  response.data.production,
                consumption:  response.data.consumption,
                netproduction:  response.data.netproduction,
                buffer:  response.data.buffer,
                blackout:  response.data.blackout,
                ratio:  response.data.ratio,
                status: response.data.status,
            })
    }
    render() {
         const { id, price, display, wind, production, consumption,
         netproduction, buffer, blackout, ratio, status } = this.state
        return(
        <div className="Apphouse">
            <h1>Your Household</h1>
            <h2>Show household info</h2>
            <br />
            {/* Display data from API */}   
            <div className="profiles"> 
                <div className="profile">
                    <h2>ID: {id} </h2>
                    <div className="details">
                <img
                    src={"data:image/png;base64," + display}
                    alt='Look here'/>
                <br/>
                <p><b>current market price: </b> {price} sek/kW</p>
                <p><b>wind: </b> {wind} m/s </p>
                <p><b>production: </b> {production} kW/h </p>
                <p><b>consumption: </b> {consumption} kw/h </p>
                <p><b>netproduction: </b> {netproduction} kW/h </p>
                <p><b>buffer: </b> {buffer} kW </p>
                <p><b>blackout: </b> {String(blackout)}</p>                
                <p><b>ratio: </b> {ratio} </p>
                </div>
                </div>
                </div>
            </div>   
        );
}
}

UserProfile.propTypes = {
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
  )( UserProfile );
