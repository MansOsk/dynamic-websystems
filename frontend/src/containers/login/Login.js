import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import "./Login.css";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      role: "user",
      errors: {}
    };
  }

  componentDidMount() {  //HITTA ETT SÄTT ATT ROUTA MANAGERDASHBOARD
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.user.role==="manager") {
      this.props.history.push("/managerdashboard");
    }
    else if (this.props.auth.user.role==="user") {
        this.props.history.push("/dashboard");
      }
    }

  UNSAFE_componentWillReceiveProps(nextProps) {
  //if (nextProps.auth.isAuthenticated) {
  // this.props.history.push("/register"); // push user to dashboard when they login (private page to be implemented)
  //}
  if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };


onSubmit = e => {
    e.preventDefault();

const userRole = this.state.role

const userData = {
  email: this.state.email,
  password: this.state.password
};

//  this.props.loginUser(userData); //
this.props.loginUser(userRole, userData, this.props.history); 
};

render() {
    const { errors } = this.state;
return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left"></i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Login</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>

              {/* EMAIL */}
              <div className="input-field col s12">
              <label htmlFor="email">Email</label>
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                />
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>

              {/*PASSwORd */}
              <div className="input-field col s12">
              <label htmlFor="password">Password</label>
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
              </div>

              {/* <div className="input-field col s12">
               <label htmlFor="role">Role</label>
              <input
                onChange={this.onChange}
                value={this.state.role}

                id="role"
                type="text"
              />
              </div> */}

              
              {/* RROOLLEE */}
              <div>
                <label htmlFor="role">Role</label>
                <select
                  onChange={this.onChange}
                  value={this.state.role}
                  id="role"
                  type="text"
                  >
                <option value="User">User</option>
                <option value="Manager">Manager</option>
                </select>      
              </div>        

              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  man: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  man: state.man
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Login));