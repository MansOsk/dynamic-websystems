import React, { Component ,useState } from "react";
import axios from 'axios';
import FileBase from 'react-file-base64';
import DefaultImg from './defaultimg.png';
import "./UserProfile.css";

const [userData, setUserData] = useState(null);    
const fetchData = async () => {
    const response = await axios.get("/api/household");
    setUserData(response.data);
  }

function UserProfile (props){

        //this.state = {
        //    baseImage: DefaultImg
        //}
        //constructor(props) {
        //super(props);

    //setDefaultImage() {
    //    this.setState({
    //        baseImage: DefaultImg
    //    });
    //}

    // function to capture base64 format of an image

        return(
        fetchData(),
        <div className="Apphouse">
            <h1>Your Household</h1>
            <h2>Show household info</h2>
            {/* Fetch data from API */}
            <br />
            {/* Display data from API */}   
            <div className="profiles"> 
                {userData && userData.map((data, index) => {
                    return (
                        <div className="profile" key={index}>
                            <h2>ID: {data.houseid}</h2>
                            <div className="details">
                                <p>Wind:{data.wind} m/s</p>
                                <p>Production:{data.production} kW/h</p>
                                <p>Consumption:{data.consumption} kW/h</p>
                                <p>Netto production:{data.netproduction} kW/h</p>
                                <p>Buffer:{data.buffer} kW</p>
                                <p>Blackout:{data.blackout}</p>
                                <p>Price:{data.price} sek</p>
                                <p>Ratio:{data.ratio}</p>
                            </div>
                            </div>
                    );
                })} 
                </div>
            </div>   
        );
}

function getBaseFile(files) {
    // create a local readable base64 instance of an image
    this.setState({
      baseImage: files.base64
    });

    var img = files.base64.toString()

    axios.post("api/household/" + userData.houseid, img)
      .then((data) => {
        if (data.data.success) {
          alert("Image has been successfully uploaded using base64 format");
          this.setDefaultImage("base");
        }
      })
      .catch((err) => {
        console.log(userData.houseid);
        alert("Error while uploading image using base64 format")
        this.setDefaultImage("base");
      });
      return(
        <div>
            <div>
                <FileBase type="file" multiple={false} onDone={this.getBaseFile.bind(this)} />
            </div>
            <img src={this.state.baseImage} alt="upload-image" className="process__image" />
            </div>
      );
    }

export default UserProfile;
