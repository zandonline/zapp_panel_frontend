import axios from "axios";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { FormGroup, Input, Label, Button, Container, Row, Col, Badge, Modal, ModalBody, ModalFooter } from 'reactstrap';
import config from "../config";
import db from "../helpers/localDB";
import moment from "moment-jalaali";
import CityInput from './city';
import { DatePicker} from "react-advance-jalaali-datepicker";

class Driver extends Component {
  constructor(props) {
    super(props);

    this.avatarBtn = React.createRef();

    this.state = {
      isActive: 0,
      driverId: "",
      phoneNumber: "",
      avatar: null,
      tempAvatar: null,
      name: "",
      familyName: "",
      nationalCode: "",
      idNumber: "",
      gender: 0,
      birthDate: "",
      birthDateUnix: "",
      birthCity: "",
      fatherName: "",
      address: "",
      postalCode: "",
      homePhoneNumber: "",
      jobType: 0,
      maritalStatus: 0,
      militaryStatus: 0,
      carLicenseType: 0,
      carLicenseDate: "",
      carLicenseDateUnix:"",
      carLicenseExpireTime: "",
      carName: "",
      carColor: "",
      carBuiltDate: "",
      carPlate: "",
      carOwnerName: "",
      carOwnerNationalCode: "",
      carInsuranceExpireDate: "",
      carInsuranceExpireDateUnix:"",
      carTechnicalDiagnosisExpireDate: "",
      carTechnicalDiagnosisExpireDateUnix: "",
      carInsuranceName: "",
      bankAccountName: "",
      bankAccountNumber: "",
      bankAccountShebaNumber: "",
      bankAccountCardNumber: "",
      cityId:'',
      alert: {
        status: false,
        message: ""
      }
    };
  }

  async componentDidMount() {
    let driverId = this.props.match.params.id;
    try {
      let result = await axios({
        url: config.app.BASE_URL + "panel/index/driver/" + driverId,
        method: "get",
        headers: {
          Authorization: `Bearer ${db.get("token").value()}`,
          "Content-Type": "application/json"
        }
      });

      if (result.data.status === 200) {
       
        let driver = result.data.driver;
        let m=String(driver.birthDate).substring(0,10)
       console.log(m)
        this.setState({
          isActive: driver.isActive,
          driverId,
          avatar: driver.avatar,
          tempAvatar: null,
          name: driver.name,
          familyName: driver.familyName,
          nationalCode: driver.nationalCode,
          idNumber: driver.idNumber,
          gender: driver.gender,
          birthDate:moment.unix(String(driver.birthDate).substring(0,10)).format("jYYYY/jMM/jDD") ,
          birthDateUnix:driver.birthDate,
          birthCity: driver.birthCity,
          fatherName: driver.fatherName,
          address: driver.address,
          postalCode: driver.postalCode,
          homePhoneNumber: driver.homePhoneNumber,
          jobType: driver.jobType,
          maritalStatus: driver.maritalStatus,
          militaryStatus: driver.militaryStatus,
          carLicenseType: driver.carlicenseType,
          carLicenseDate: moment.unix(String(driver.carlicenseDate).substring(0,10)).format("jYYYY/jMM/jDD"),
          carLicenseDateUnix:driver.carlicenseDate,
          carLicenseExpireTime: driver.carlicenseExpireTime,
          carName: driver.carName,
          carColor: driver.carColor,
          carBuiltDate: driver.carBuiltDate,
          carPlate: driver.carPlate,
          carOwnerName: driver.carOwnerName,
          carOwnerNationalCode: driver.carOwnerNationalCode,
          carInsuranceExpireDate:moment.unix(String( driver.carInsuranceExpireTime).substring(0,10)).format("jYYYY/jMM/jDD"),
          carInsuranceExpireDateUnix: driver.carInsuranceExpireTime,
          carTechnicalDiagnosisExpireDate:
          moment.unix( String(driver.carTechnicalDiagnosisExpireDate).substring(0,10)).format("jYYYY/jMM/jDD"),
          carTechnicalDiagnosisExpireDateUnix:driver.carTechnicalDiagnosisExpireDate,
          carInsuranceName: driver.carInsuranceName,
          phoneNumber: driver.phoneNumber,
          bankAccountName: driver.bankAccountName,
          bankAccountNumber: driver.bankAccountNumber,
          bankAccountShebaNumber: driver.bankAccountShebaNumber,
          bankAccountCardNumber: driver.bankAccountCardNumber

        });
      }
    } catch (e) { }
   
   
  }

  handleActiveBtn = async (e) => {
    e.preventDefault();

    let url = "";
    if (this.state.isActive === 1) {
      url = config.app.BASE_URL + "access/driver/ban";
    } else {
      url = config.app.BASE_URL + "access/driver/accept";
    }
    try {
      let result = await axios.post(url, {
        phoneNumber: this.state.phoneNumber
      }, {
          headers: {
            Authorization: `Bearer ${db.get("token").value()}`,
            "Content-Type": "application/json"
          }
        });





      this.setState({
        alert: {
          status: true,
          message: result.data.message
        }
      })


    } catch (e) {

      this.setState({
        alert: {
          status: true,
          message: e.message
        }
      })
    }



  }



  handleAlertBtn = () => {
    this.setState({
      alert: {
        status: false,
        message: ""
      }
    });
  };

  handleAvatarBtn = e => {
    this.avatarBtn.current.click();
  };

  handleSubmitBtn = async e => {
    e.preventDefault();

 // console.log("to server:" + this.state.birthDate);

    try {
      let result = await axios.post(
        config.app.BASE_URL + "panel/driver/edit",
        {

          avatar: this.state.tempAvatar !== null ? this.state.tempAvatar : null,

          driverId: this.state.driverId,

          name: this.state.name,

          familyName: this.state.familyName,

          nationalCode: this.state.nationalCode,

          idNumber: this.state.idNumber,

          birthCity: this.state.birthCity,

          fatherName: this.state.fatherName,


          birthDate: this.state.birthDateUnix,//timestamp

          gender: this.state.gender,

          address: this.state.address,

          postalCode: this.state.postalCode,

          homePhoneNumber: this.state.homePhoneNumber,

          maritalStatus: this.state.maritalStatus,

          militaryStatus: this.state.militaryStatus,

          jobType: this.state.jobType,

          licenseDate: this.state.carLicenseDateUnix,//timestamp

          licenseType: this.state.carLicenseType,

          licenseExpireTime: this.state.carLicenseExpireTime,

          carPlate: this.state.carPlate,

          carName: this.state.carName,

          carBuildDate: moment(this.state.carBuiltDate).unix(),//timestamp

          carColor: this.state.carColor,

          carOwnerName: this.state.carOwnerName,

          carOwnerNationalCode: this.state.carOwnerNationalCode,

          carInsuranceName: this.state.carInsuranceName,

          carInsuranceExpireDate:this.state.carInsuranceExpireDateUnix,//timestamp

          carTechnicalDiagnosisExpireDate: this.state.carTechnicalDiagnosisExpireDateUnix,//timestamp

          phoneNumber: this.state.phoneNumber,

          bankAccountName: this.state.bankAccountName,

          bankAccountNumber: this.state.bankAccountNumber,

          bankAccountCardNumber: this.state.bankAccountCardNumber,

          bankAccountShebaNumber: this.state.bankAccountShebaNumber,

          cityId:this.state.cityId

        },
        {
          headers: {
            Authorization: `Bearer ${db.get("token").value()}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("--------" + result.data);

      this.setState({
        alert: {
          status: true,
          message: result.data.message
        }
      });

    } catch (e) {
      console.log("--------" + e);

      this.setState({
        alert: {
          status: true,
          message: e.message
        }
      });
    }
  };

  changeAvatar = input => {
    if (input.target.files && input.target.files[0]) {
      let reader = new FileReader();

      reader.readAsDataURL(input.target.files[0]);
      reader.onload = e => {
        this.setState({ tempAvatar: e.target.result, avatar: null });
      };
      reader.onerror = e => { };
    }
  };


  handleGenderInput = (e) => {

    this.setState({
      gender: e.target.value
    });

  }

  handleNameInput = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  handleFamilyNameInput = (e) => {

    this.setState({
      familyName: e.target.value
    })

  }

  handleNationalCodeInput = (e) => {

    this.setState({
      nationalCode: e.target.value
    })

  }

  handleIdNumberInput = (e) => {

    this.setState({
      idNumber: e.target.value
    });

  }

  handleBirthDateInput = (e,f) => {

    this.setState({
      birthDate:f ,
      birthDateUnix:e

    });

  }

  handleFatherNameInput = (e) => {

    this.setState({
      fatherName: e.target.value
    })

  }

  handleBirthCityInput = (e) => {

    this.setState({
      birthCity: e.target.value
    })

  }

  handleAddressInput = (e) => {

    this.setState({
      address: e.target.value
    })

  }

  handlePostalCodeInput = (e) => {

    this.setState({
      postalCode: e.target.value
    })

  }

  handleHomePhoneNumberInput = (e) => {

    this.setState({
      homePhoneNumber: e.target.value
    })

  }

  handleJobTypeInput = (e) => {

    this.setState({
      jobType: e.target.value
    })

  }

  handleMaritalStatusInput = (e) => {

    this.setState({
      maritalStatus: e.target.value
    })

  }

  handleCarlicenseTypeInput = (e) => {

    this.setState({
      carlicensetype: e.target.value
    })
    console.log(this.state.carlicenseType)

  }

  handleCarPlateInput = (e) => {
    this.setState({
      carPlate: e.target.value
    })
  }

  handleMilitaryStatusInput = (e) => {

    this.setState({
      militaryStatus: e.target.value
    })

  }

  handleCarLicenseDateInput = (unix,formal) => {

    this.setState({
      carLicenseDate: formal,
      carLicenseDateUnix:unix
    })

  }

  handleCarlicenseExpireTimeInput = (e) => {

    this.setState({
      carLicenseExpireTime: e.target.value
    })

  }


  handleCarNameInput = (e) => {

    this.setState({
      carName: e.target.value
    })

  }

  handleCarColorInput = (e) => {

    this.setState({
      carColor: e.target.value
    })

  }

  handleCarOwnerNameInput = (e) => {

    this.setState({
      carOwnerName: e.target.value
    })

  }

  handleCarOwnerNationalCodeInput = (e) => {

    this.setState({
      carOwnerNationalCode: e.target.value
    })

  }

  handleCarBuiltDateInput = (e) => {

    this.setState({
      carBuiltDate: e.target.value
    })

  }

  handleCarInsuranceExpireDateInput = (unix,formal) => {

    this.setState({
      carInsuranceExpireDate:formal,
      carInsuranceExpireDateUnix:unix
    })

  }

  handleCarTechnicalDiagnosisExpireDateInput = (unix,formal) => {

    this.setState({
      carTechnicalDiagnosisExpireDate: formal,
      carTechnicalDiagnosisExpireDateUnix:unix
    })

  }



  handleCarInsuranceNameInput = (e) => {

    this.setState({
      carInsuranceName: e.target.value
    })

  }



  handleBankAccountNameInput = (e) => {

    this.setState({
      bankAccountName: e.target.value
    });

  }
  handleBankAccountNumberInput = (e) => {
    this.setState({
      bankAccountNumber: e.target.value
    });
  }
  handleBankAccountCardNumberInput = (e) => {
    this.setState({
      bankAccountCardNumber: e.target.value
    });
  }
  handleBankAccountShebaNumberInput = (e) => {
    this.setState({
      bankAccountShebaNumber: e.target.value
    });
  }


  handleCity = (data) => { 
   
    this.setState({
      cityId : data,
     
    });
  
  };
  





  render() {
    return (
      <Container>
        <Row>
          <Col md="10">
            <p className="d-inline-block h4 p-2">وضعیت حساب کاربری</p>
            <span className="badge badge-info p-2">{this.state.isActive === 1 ? "فعال" : "غیر فعال"}</span>

            <Badge></Badge>
          </Col>
          <Col md="2">

            {(this.state.isActive === 1) ? <button onClick={this.handleActiveBtn} className="btn btn-danger m-2">
              بن کردن راننده
            </button> : <button onClick={this.handleActiveBtn} className="btn btn-success m-2">
                فعال کردن کاربر
            </button>}



          </Col>
        </Row>



        <Row>
          <Col>

            <Modal isOpen={this.state.alert.status} toggle={this.handleAlertBtn}>
              <ModalBody>

                {this.state.alert.message}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onClick={this.handleAlertBtn}>باشه</Button>{' '}
              </ModalFooter>
            </Modal>

            <img
              alt=""
              src={
                this.state.avatar !== null
                  ? config.app.DRIVER_IMAGE_URL + this.state.avatar : ""
              }
              className="img-fluid rounded shadow-lg d-block m-auto"
            />
            <img
              alt=""
              src={this.state.tempAvatar}
              className="img-fluid rounded shadow-lg d-block mx-auto mb-2"
            />
            <Button
              color="primary"
              onClick={this.handleAvatarBtn}
              className="m-auto d-block">
              تغییر عکس
            </Button>

            <input
              ref={this.avatarBtn}
              className="form-control mb-5"
              onChange={this.changeAvatar}
              type="file"
              hidden
              accept="image/png,image/jpeg,image/jpg"
            />


            {/* <FormGroup>
          <Label for="avatarBtn">File</Label>
          <Input ref={this.avatarBtn} type="file" id="avatarBtn"  hidden accept="image/png,image/jpeg,image/jpg"/>
        </FormGroup> */}






            <form onSubmit={this.handleSubmitBtn}>
              <p className="h3 text-right text-white">اطلاعات شخصی</p>

              <FormGroup>
                <Label htmlFor="name">نام</Label>
                <Input type="text" id="name" value={this.state.name} onChange={this.handleNameInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="familyName">نام خانوادگی</Label>
                <Input type="text" id="familyName" value={this.state.familyName} onChange={this.handleFamilyNameInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="nationalCode">کد ملی</Label>
                <Input type="text" id="nationalCode" value={this.state.nationalCode} onChange={this.handleNationalCodeInput} />
              </FormGroup>


              <CityInput onSelectCity={this.handleCity}></CityInput>

              <FormGroup>
                <Label htmlFor="idNumber">شماره شناسنامه</Label>
                <Input type="text" id="idNumber" value={this.state.idNumber} onChange={this.handleIdNumberInput} />
              </FormGroup>



              <FormGroup className="text-right">
                <Label htmlFor="gender">جنسیت</Label>
                <Input value={this.state.gender} type="select" id="gender" onChange={this.handleGenderInput}>
                  <option value={0}>آقا</option>
                  <option value={1}>خانوم</option>
                </Input>
              </FormGroup>


              <FormGroup>
                <Label htmlFor="birthDate">تاریخ تولد</Label>
                <div>{this.state.birthDate}</div>
                {/* <Input type="date" id="birthDate" onChange={this.handleBirthDateInput} value={this.state.birthDate} /> */}
                <DatePicker
                    placeholder="انتخاب تاریخ "
                    format="jYYYY/jMM/jDD"
                    preSelected={this.state.birthDate}
                    id="dateTimePicker2"
                    onChange={this.handleBirthDateInput}

                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="fatherName">نام پدر</Label>
                <Input type="text" id="fatherName" value={this.state.fatherName} onChange={this.handleFatherNameInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="birthCity">محل تولد</Label>
                <Input type="text" id="birthCity" value={this.state.birthCity} onChange={this.handleBirthCityInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="address">آدرس</Label>
                <Input type="text" id="address" value={this.state.address} onChange={this.handleAddressInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="postalCode">کد پستی</Label>
                <Input type="text" id="postalCode" value={this.state.postalCode} onChange={this.handlePostalCodeInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="homePhoneNumber">شماره ثابت</Label>
                <Input type="text" id="homePhoneNumber" value={this.state.homePhoneNumber} onChange={this.handleHomePhoneNumberInput} />
              </FormGroup>


              <FormGroup className="text-right">
                <Label htmlFor="jobType">وضعیت اشتغال</Label>
                <Input value={this.state.jobType} type="select" id="jobType" onChange={this.handleJobTypeInput}>
                  <option value={1}>تمام وقت</option>
                  <option value={2}>پاره وقت</option>
                  <option value={3}>شغل آزاد</option>
                  <option value={4}>بیکار</option>
                  <option value={5}>دانشجو</option>
                  <option value={6}>سایر</option>
                </Input>
              </FormGroup>


              <FormGroup className="text-right">
                <Label htmlFor="maritalStatus">وضعیت تاهل</Label>
                <Input value={this.state.maritalStatus} type="select" id="maritalStatus" onChange={this.handleMaritalStatusInput}>
                  <option value={1}>مجرد</option>
                  <option value={0}>متاهل</option>

                </Input>
              </FormGroup>



              <FormGroup className="text-right">
                <Label htmlFor="militaryStatus">وضعیت نظام وظیفه</Label>
                <Input value={this.state.militaryStatus} type="select" id="militaryStatus" onChange={this.handleMilitaryStatusInput}>
                  <option value={1}>پایان خدمت</option>
                  <option value={2}>معافیت پزشکی</option>
                  <option value={3}>معافیت غیر پزشکی</option>
                  <option value={5}>در حین خدمت</option>
                  <option value={6}>سایر</option>
                </Input>
              </FormGroup>




              <p className="h3 text-right text-white">اطلاعات گواهی نامه</p>

              <div className="form-group">
                <label htmlFor="carlicenseType">نوع گواهی نامه</label>
                <Input value={this.state.carlicenseType} type="select" id="carLicenseType" onChange={this.handleCarlicenseTypeInput}>

                  <option value={1}>پایه 1</option>
                  <option value={2}>پایه 2</option>
                  <option value={3}>3 پایه</option>
                </Input>

              </div>

              <FormGroup>
                <Label htmlFor="carLicenseDate">تاریخ صدور گواهی نامه</Label>
                {/* <Input type="date" id="carLicenseDate" value={this.state.carLicenseDate} onChange={this.handleCarLicenseDateInput} /> */}
                <div>{this.state.carLicenseDate}</div>
                <DatePicker
                    placeholder="انتخاب تاریخ "
                    format="jYYYY/jMM/jDD"
                    preSelected={this.state.carLicenseDate}
                    id="dateTimePicker3"
                    onChange={this.handleCarLicenseDateInput}

                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="carlicenseExpireTime">مدت اعتبار</Label>
                <Input type="text" id="carlicenseExpireTime" value={this.state.carLicenseExpireTime} onChange={this.handleCarlicenseExpireTimeInput} />
              </FormGroup>

              <p className="h3 text-right text-white">اطلاعات خودرو</p>

              <FormGroup>
                <Label htmlFor="carName">نام خودرو</Label>
                <Input type="text" id="carName" value={this.state.carName} onChange={this.handleCarNameInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="carColor">رنگ خودرو</Label>
                <Input type="text" id="carColor" value={this.state.carColor} onChange={this.handleCarColorInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="carBuiltDate">سال ساخت خودرو</Label>
                <Input type="date" id="carBuiltDate" value={this.state.carBuiltDate} onChange={this.handleCarBuiltDateInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="carPlate">پلاک</Label>
                <Input type="text" id="carPlate" value={this.state.carPlate} onChange={this.handleCarPlateInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="carOwnerName">نام مالک خودرو</Label>
                <Input type="text" id="carOwnerName" value={this.state.carOwnerName} onChange={this.handleCarOwnerNameInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="carOwnerNationalCode">کد ملی مالک خودرو</Label>
                <Input type="text" id="carOwnerNationalCode" value={this.state.carOwnerNationalCode} onChange={this.handleCarOwnerNationalCodeInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="carInsuranceExpireDate">تاریخ انقضا بیمه</Label>
                <div>{this.state.carInsuranceExpireDate}</div>
                {/* <Input type="date" id="carInsuranceExpireDate" value={this.state.carInsuranceExpireDate} onChange={this.handleCarInsuranceExpireDateInput} /> */}
                <DatePicker
                    placeholder="انتخاب تاریخ "
                    format="jYYYY/jMM/jDD"
                    preSelected={this.state.carInsuranceExpireDate}
                    id="dateTimePicker4"
                    onChange={this.handleCarInsuranceExpireDateInput}

                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="carTechnicalDiagnosisExpireDate">تاریخ انقضا معاینه فنی</Label>
                <div>{this.state.carTechnicalDiagnosisExpireDate}</div>
                {/* <Input type="date" id="carTechnicalDiagnosisExpireDate" value={this.state.carTechnicalDiagnosisExpireDate} onChange={this.handleCarTechnicalDiagnosisExpireDateInput} /> */}
                <DatePicker
                    placeholder="انتخاب تاریخ "
                    format="jYYYY/jMM/jDD"
                    preSelected={this.state.carTechnicalDiagnosisExpireDate}
                    id="dateTimePicker5"
                    onChange={this.handleCarTechnicalDiagnosisExpireDateInput}

                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="carInsuranceName">نام شرکت بیمه</Label>
                <Input type="text" id="carInsuranceName" value={this.state.carInsuranceName} onChange={this.handleCarInsuranceNameInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="bankAccountName">نام بانک</Label>
                <Input type="text" id="bankAccountName" value={this.state.bankAccountName} onChange={this.handleBankAccountNameInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="bankAccountNumber">شماره حساب بانکی</Label>
                <Input type="text" id="bankAccountNumber" value={this.state.bankAccountNumber} onChange={this.handleBankAccountNumberInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="bankAccountCardNumber">شماره کارت</Label>
                <Input type="text" id="bankAccountCardNumber" value={this.state.bankAccountCardNumber} onChange={this.handleBankAccountCardNumberInput} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="bankAccountShebaNumber">شماره شبا</Label>
                <Input type="text" id="bankAccountShebaNumber" value={this.state.bankAccountShebaNumber} onChange={this.handleBankAccountShebaNumberInput} />
              </FormGroup>



              <Button color="primary" className="m-auto d-block">تغییر اطلاعات</Button>

            </form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(Driver);
