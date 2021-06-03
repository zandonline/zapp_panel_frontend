import React, { Component } from "react";
import axios from "axios";
import db from "../helpers/localDB";
import { withRouter,Link } from "react-router-dom";
import { Modal, ModalBody, ModalFooter,Button } from 'reactstrap';

// import {connect} from "react-redux";

import config from "../config"

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      phoneNumber: "",
      password: "",
      alert: {
        status: false,
        message: ""
      }
    };
  }


  handlePhoneNumber = e => {
    e.preventDefault();

    this.setState({
      phoneNumber: e.target.value
    });
  };

  handlePassword = e => {
    e.preventDefault();

    this.setState({
      password: e.target.value
    });
  };

  handleAlertBtn = () => {
    this.setState({
      alert: {
        status: false,
        message: ""
      }
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    try {
      let result = await axios.post(
        config.app.BASE_URL + "auth/agent/login",
        {
          phoneNumber: this.state.phoneNumber,
          password: this.state.password
        }
      );

      if (result.data.status === 200) {
        db.set("token", result.data.token).write();
        db.set("role", result.data.role).write();
        db.set("city", result.data.city).write();
        

        this.props.login();

        switch(result.data.role){

          case "agent":
          this.props.history.push("/agent/home");

          break;

          case "superAgent":
          this.props.history.push("/superagent/home");

          break;

          case "admin":
          this.props.history.push("/admin/home");

          break;
          default:
          this.props.history.push("/agent/home");

          break;
        }

      } else {
        this.setState({
          alert: {
            status: true,
            message: result.data.message
          }
        });
      }
    } catch (e) {
      this.setState({
        alert: {
          status: true,
          message: e.message
        }
      });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 mt-4">




            <Modal isOpen={this.state.alert.status} toggle={this.handleAlertBtn}>
              <ModalBody>

                {this.state.alert.message}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.handleAlertBtn}>باشه</Button>{' '}
              </ModalFooter>
            </Modal>




            <h1 className="text-right">ورود به حساب کاربری</h1>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="phoneNumber" className="d-block text-right">
                  شماره همراه
                </label>
                <input
                  required
                  type="number"
                  className="form-control"
                  id="phoneNumber"
                  onChange={this.handlePhoneNumber}
                  placeholder="شماره همراه خود را وارد کنید"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="d-block text-right">
                  رمز عبور
                </label>
                <input
                  required
                  type="password"
                  className="form-control"
                  id="password"
                  onChange={this.handlePassword}
                  placeholder="رمز عبور خود را وارد کنید"
                />
              </div>

              <button type="submit" className="btn btn-primary float-right">
                ورود
              </button>

              <Link to="/panel/password/forgot" className="mx-auto text-center text-dark">رمز عبور خود را فراموش کردم</Link>


            </form>
          </div>
        </div>
      </div>
    );
  }
}


export default withRouter(Login);


