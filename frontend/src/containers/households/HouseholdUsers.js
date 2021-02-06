import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { displayDatabase } from "../../actions/authActions";
import axios from 'axios';
import "./Households.css";

class HouseholdUsers extends Component {
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

    onEditClick = (e, id) => { 
        e.preventDefault();
        console.log("ID:", id);
        const path = `/profile/${id}`;
        this.props.history.push(path);
      }

    tick = async () => {    

            var kind = "user";
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
            <h1>Users</h1>
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
                        <p>email:{item.email} </p>
                        <p>firstname:{item.firstname} </p>
                        <p>lastname:{item.lastname} </p>
                        <p>address:{item.address} </p>
                        <p>logged in:{item.status} </p>
                        {/*EDIT PROFILE BUTTON*/}
                        <button
                        style={{
                            width: "150px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px",
                            marginTop: "1rem"
                        }}
                        onClick={(e) => this.onEditClick(e, item.id)}
                        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                        >
                        Edit profile
                        </button>
                    </div>
                </div>
            )}
            
            </div>
        </div>   
        );
    }
}

HouseholdUsers.propTypes = {
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
  )( HouseholdUsers );