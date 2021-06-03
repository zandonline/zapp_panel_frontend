import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Select from 'react-select'
import config from "../config";

import { Modal, ModalBody, ModalFooter,Button } from "reactstrap";
import largeBackgroundImg from '../assets/images/registerBG.png';
import '../css/register.css';

const styles = {
  backgroundImage: `url(${largeBackgroundImg})`,
}
class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: "",
      nationalCode: "0000000000",
      city: "",
      phoneNumber: "",
	  homePhoneNumber:"",
      password: "zapptaxi123",
      email: "a@a.com",
      role: 1,
      cities: [],
      options: [],
	  description:"",
      amount: 50000,
      alert: {
        status: false,
        message: ""
      }
    };
  }

  handleFullNameInput = e => {
    e.preventDefault();

    this.setState({
      fullName: e.target.value
    });
  };
  handleNationalCodeInput = e => {
    e.preventDefault();

    this.setState({
      nationalCode: e.target.value
    });
  };
  handleCityInput = e => {
    // e.preventDefault();

    this.setState({
      city: e.value
    });

  };
  handlePhoneNumberInput = e => {
    e.preventDefault();

    this.setState({
      phoneNumber: e.target.value
    });
  };
  handleHomePhoneNumberInput = e => {
    e.preventDefault();

    this.setState({
      homePhoneNumber: e.target.value
    });
  };
  handleEmailInput = e => {
    e.preventDefault();

    this.setState({
      email: e.target.value
    });
  };
  handleRoleInput = e => {
    e.preventDefault();

    this.setState({
      role: e.target.value
    });
  };
  handlePasswordInput = e => {
    e.preventDefault();

    this.setState({
      password: e.target.value
    });
  };
  handleAmountInput = (e) => {
    this.setState({
      amount: e.target.value
    });
  };
  
  
 handleDescriptionInput = (e) => {
    this.setState({
      description: e.target.value
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

  async componentDidMount() {

    try {
      let result = await axios.get(
        config.app.BASE_URL + "city"
      );

      // this.setState({

      //     cities: result.data.cities

      // });

      let optionsArr = [];


      for (let _city of result.data.cities) {
        optionsArr.push({ value: _city._id, label: _city.name });

      }
      this.setState({
        options: optionsArr
      });


    } catch (e) {
      this.setState({
        alert: {
          status: true,
          message: "خطا در برقراری ارتباط با سرور"
        }
      });
    }

  }

  handleSubmit = async e => {
    e.preventDefault();

    try {
      let result = await axios.post(
        config.app.BASE_URL + "auth/agent/register",
        {
          fullName: this.state.fullName,
          nationalCode: this.state.nationalCode,
          cityId: this.state.city,
          phoneNumber: this.state.phoneNumber,
		  homePhoneNumber:this.state.homePhoneNumber,
		  description:this.state.description,
          password: this.state.password,
          email: this.state.email,
          roleId: this.state.role,
          amount: this.state.amount
        }
      );

      if (result.data.status === 200) {

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
      <section className="register-main " style={styles} >
        <div className="container-fluid ">
          <h3 className="text-left text-white w-75 position-absolute py-3 pl-5">ثبت نام به عنوان همکار</h3>
          <div className="row register-box overflow-hidden w-75 float-left mt-4 position-relative ">

 <Modal
              isOpen={this.state.alert.status}
              toggle={this.handleAlertBtn}
            >
              <ModalBody>{this.state.alert.message}</ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.handleAlertBtn}>
                  باشه
                </Button>{" "}
              </ModalFooter>
            </Modal>

            <div className="col-md-6 register-text-box p-3">
              <h5 className="font-weight-bold">به دنیایی از فرصت و تکنولوژی خوش آمدید  </h5>
              <p>
                تاکسی اینترنتی زَپ در راستای اهداف توسعه ی منطقه ای خود، در شهر شما نمایندگی فعال می پذیرد.
                </p>
              <h6 className="font-weight-bold">شریط پذیرش نمایندگی  </h6>
              <ul>
                <li className="py-2">
                  دارا بودن محل مناسب، جهت ثبت مجوز و فعالیت منطقه ای.
                    </li>
                <li className="py-2">
                  آشنایی با کامپیوتر و ICDL مزیت محسوب می شود.
                    </li>
                <li className="py-2">
                  تنها در صورتی که از انگیزه کافی برخوردار هستید، و در جستجوی توسعه ی
                  شغلی می باشد ، ثبت نام کنید.
                  <br />
                  *نکته: کلیه مجوز های لازم ، جهت فعالیت توسط تاکسی اینترنتی زَپ اخذ می گردد.
                    </li>
                <li className="py-2">
                  آموزش های لازم جهت کار با سیستم و جذب و بازاریابی توسط تیم فروش انجام می گردد .
                    </li>
              </ul>
            </div>
            <div className="col-md-6 register-form-box p-3">
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label for="exampleFormControlInput1">نام و نام خانوادگی : </label>
                  <input type="text" className="form-control"
                    id="exampleFormControlInput1"
                    onChange={this.handleFullNameInput}
                    placeholder="نام کامل خود را وارد کنید " />
                </div>
                <div className="form-group">
                  <label for="exampleFormControlInput1">تلفن ثابت : </label>
                  <input type="text" className="form-control"
                    id="exampleFormControlInput1"
                    onChange={this.handleHomePhoneNumberInput}
                    placeholder="تلفن ثابت خود را وارد کنید " />
                </div>
                <div className="form-group">
                  <label for="exampleFormControlInput1">تلفن همراه : </label>
                  <input type="text" className="form-control"
                    id="exampleFormControlInput1"
					onChange={this.handlePhoneNumberInput}
                    placeholder="تلفن همراه خود را وارد کنید " />
                </div>
                <div className="form-group">
                  <label htmlFor="city" className="d-block text-right">
                  شهر
                </label>
               
                <Select  className="form-control" required id="city" onChange={this.handleCityInput} 
                options={this.state.options}/>
                
                
                </div>

                <div className="form-group">
                  <label for="exampleFormControlTextarea1">توضیحات : </label>
                  <textarea className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="1"
					onChange={this.handleDescriptionInput}
                    placeholder="در صورت داشتن شریط خاص ، این فیلد را پر کنید"
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">ثبت نام</button>
              </form>
            </div>
          </div>
        </div>

      </section>
    )
  };
}

export default Register;
