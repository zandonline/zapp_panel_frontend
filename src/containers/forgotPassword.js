import React, { Component } from "react";
import axios from "axios";
import db from "../helpers/localDB";
import { withRouter } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';

// import {connect} from "react-redux";
import config from "../config"

class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            state: 0,
            phoneNumber: "",
            code: "",
            password: "",
            alert: {
                status: false,
                message: ""
            }
        };





    }


    handlePhoneNumberInput = e => {
        e.preventDefault();

        this.setState({
            phoneNumber: e.target.value
        });
    };

    handleCodeInput = e => {
        e.preventDefault();

        this.setState({
            code: e.target.value
        });
    };

    handlePasswordInput = e => {
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

    handleSubmitBtn = async e => {
        e.preventDefault();

        try {

            console.log(this.state.state)
            let result = null;
            switch (this.state.state) {
                case 0:
                    result = await axios.post(
                        config.app.BASE_URL + "auth/agent/sendCode",
                        {
                            phoneNumber: this.state.phoneNumber,
                        }
                    );

                    if (result.data.status === 200) {

                        this.setState({
                            state: 1
                        });

                    } else {
                        this.setState({
                            alert: {
                                status: true,
                                message: result.data.message
                            }
                        });
                    }




                    break;

                case 1:


                    result = await axios.post(
                        config.app.BASE_URL + "auth/agent/verifyCode",
                        {
                            phoneNumber: this.state.phoneNumber,
                            code: this.state.code,

                        }
                    );

                    if (result.data.status === 200) {

                        this.setState({
                            state: 2
                        });

                    } else {
                        this.setState({
                            alert: {
                                status: true,
                                message: result.data.message
                            }
                        });
                    }




                    break;

                case 2:

                    result = await axios.post(
                        config.app.BASE_URL + "auth/agent/forgotpassword",
                        {
                            phoneNumber: this.state.phoneNumber,
                            code: this.state.code,
                            newPassword: this.state.password
                        }
                    );

                    if (result.data.status === 200) {

                        db.set("token", result.data.token).write();
                        db.set("role", result.data.role).write();

                        this.props.login();

                        this.props.history.push("/agent/home");

                    } else {
                        this.setState({
                            alert: {
                                status: true,
                                message: result.data.message
                            }
                        });
                    }




                    break;
                    default:
                    break;
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




                        <h1 className="text-right">فراموشی رمز عبور</h1>
                        <form onSubmit={this.handleSubmitBtn}>
                            <div className="form-group" style={this.state.state === 0 ? { display: "block" } : { display: "none" }}>
                                <label htmlFor="phoneNumber" className="d-block text-right">
                                    شماره همراه
                </label>
                                <input
                                    
                                    type="number"
                                    className="form-control"
                                    id="phoneNumber"
                                    onChange={this.handlePhoneNumberInput}
                                    placeholder="شماره همراه خود را وارد کنید"
                                />
                            </div>
                            <div className="form-group" style={this.state.state === 1 ? { display: "block" } : { display: "none" }}>
                                <label htmlFor="code" className="d-block text-right">
                                    کد
                </label>
                                <input
                                    
                                    type="text"
                                    className="form-control"
                                    id="code"
                                    onChange={this.handleCodeInput}
                                    placeholder="رمز عبور خود را وارد کنید"
                                />
                            </div>
                            <div className="form-group" style={this.state.state === 2 ? { display: "block" } : { display: "none" }}>
                                <label htmlFor="password" className="d-block text-right">
                                    رمز عبور
                </label>
                                <input
                                    
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    onChange={this.handlePasswordInput}
                                    placeholder="رمز عبور خود را وارد کنید"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary float-right">
                                ثبت
                            </button>



                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


export default withRouter(ForgotPassword);


