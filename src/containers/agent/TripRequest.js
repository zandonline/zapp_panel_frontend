import React, { Component } from "react";
import L from "leaflet";
import { withRouter } from "react-router-dom";
import {
  Form,
  Label,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Input,
  CardImg,
  CardText,
  CardTitle,
  CustomInput
} from "reactstrap";
import axios from "axios";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

import config from "../../config";
import db from "../../helpers/localDB";
import { runInThisContext } from "vm";

import { withLeaflet } from "react-leaflet";
import Locate from "leaflet.locatecontrol";

var markers = [];
var points = [];
var latPoint = [];
var lngPoint = [];

class TripReuqest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: [],

      currentPoint: [],
      currentAddress: "",

      nearDrivers: [],
      nearDriversMarkers: [],

      nearDriver: {
        avatar: "",
        name: "نام راننده",
        phoneNumber: "0",
        car: {
          name: "",
          plate: "",
          color: ""
        }
      },

      latPoint: [],
      latAddress: "",
      latMarker: null,
      lngPoint: [],
      lngMarker: null,
      lngAddress: "",

      lng2Point: [],
      lng2Marker: null,
      lng2Address: "",

      tripStopTime: 0,
      tripCost: 0,
      tripIsTwoWay: 0,
      carType:0,
      tripType:0,

      isNewPassenger:false,
      passengerFullName:"",

      alert: {
        status: false,
        message: ""
      }

    };

    ////////////////////////////////////////////
  }

  handleAlertBtn = () => {
    this.setState({
      alert: {
        status: false,
        message: ""
      }
    });
  };


  componentDidMount() {
    // let city = db.get("city").value();
  
    this.map = L.map("tripRequestMap", {
      center: {
        lat: 29.5926,
        lng:52.5836
      },
      zoom: 11
    });

    // add the OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(this.map);

    //GET LOCATION

    const { options, startDirectly } = this.props;
    // const { map } = this.props.leaflet;

    const lc = new Locate(options);
    lc.addTo(this.map);

    if (startDirectly) {
      // request location update and set location
      lc.start();
    }













    this.map.on("click", async e => {
      //remove last markers
      if (this.state.markers.length > 0) {
        for (let i = 0; i < this.state.markers.length; i++) {
          this.map.removeLayer(this.state.markers[i]);
        }
      }

      //add lat marker
      let markerIcon = L.icon({
        iconUrl: config.app.ICON_IMAGE_URL + "marker.png",
        iconSize: [48, 48]
      });
      let marker = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: markerIcon
      }).addTo(this.map);

      this.state.markers.push(marker);

      this.setState({
        currentPoint: [e.latlng.lat, e.latlng.lng]
      });

         //find near driver
         try {
          let nearDriverRes = await axios({
            method: "post",
            url: config.app.BASE_URL + "panel/driver/find/near",
            headers: {
              Authorization: `Bearer ${db.get("token").value()}`,
              "Content-Type": "application/json"
            },
            data: {
              driverType:this.state.carType,
              lat: this.state.currentPoint[0],
              lng: this.state.currentPoint[1]
            }
          });
  
          if (nearDriverRes.data.status === 200) {
            if (this.state.nearDriversMarkers.length > 0) {
              for (let i = 0; i < this.state.nearDriversMarkers.length; i++) {
                this.map.removeLayer(this.state.nearDriversMarkers[i]);
              }
            }
  
            this.setState({
              nearDrivers: nearDriverRes.data.drivers
            });
  
            this.state.nearDrivers.forEach(driver => {
              let zappCarIcon = L.icon({
                iconUrl: config.app.ICON_IMAGE_URL + "driver.png",
                iconSize: [32, 32]
              });
  
              let zappCarMarker = L.marker([driver.lat, driver.lng], {
                icon: zappCarIcon
              }).addTo(this.map);
  
              zappCarMarker.on("click", e => {
                this.setState({
                  nearDriver: driver,
                  isDriverSelected: true
                });
              });
  
              this.state.nearDriversMarkers.push(zappCarMarker);
            });
          }
        } catch (e) {}

      //get Address of that point //LONGGGGGGGGGG API
      try {
        let addressRes = await axios({
          method: "post",
          url: config.app.BASE_URL+"panel/trip/address/by/point",
          headers: {
            Authorization: `Bearer ${db.get("token").value()}`,
            "Content-Type": "application/json"
          },
          data:{
            lat:e.latlng.lat,
            lng:e.latlng.lng
          }
        });

        if (addressRes.data.status === 200) {
          this.setState({
            currentAddress: addressRes.data.address
          });
        } else {
          this.setState({
            currentAddress: "نا مشخص"
          });
        }
      } catch (e) {}

   
    });
  }

  onLatAddressClicked = async e => {
    if(this.state.currentPoint.length==0){
      return;
    }
    this.setState({
      latPoint: this.state.currentPoint,
      latAddress: this.state.currentAddress
    });
    if (this.state.latMarker) {
      this.map.removeLayer(this.state.latMarker);
    }

    let latIcon = L.icon({
      iconUrl: config.app.ICON_IMAGE_URL + "lat.png",
      iconSize: [48, 48]
    });
    let latMarker = L.marker(this.state.currentPoint, {
      icon: latIcon
    }).addTo(this.map);

    this.setState({
      latMarker: latMarker
    });
  };

  onLngAddressClicked = async e => {

    if(this.state.currentPoint.length==0){
      return;
    }

    this.setState({
      lngPoint: this.state.currentPoint,
      lngAddress: this.state.currentAddress
    });

    if (this.state.lngMarker) {
      this.map.removeLayer(this.state.lngMarker);
    }

    let latIcon = L.icon({
      iconUrl: config.app.ICON_IMAGE_URL + "lng.png",
      iconSize: [48, 48]
    });
    let lngMarker = L.marker(this.state.currentPoint, {
      icon: latIcon
    }).addTo(this.map);

    this.setState({
      lngMarker: lngMarker
    });
  };

  onLng2AddressClicked = async e => {

    if(this.state.currentPoint.length==0){
      return;
    }

    this.setState({
      lng2Point: this.state.currentPoint,
      lng2Address: this.state.currentAddress
    });

    if (this.state.lng2Marker) {
      this.map.removeLayer(this.state.lng2Marker);
    }

    let latIcon = L.icon({
      iconUrl: config.app.ICON_IMAGE_URL + "lng2.png",
      iconSize: [48, 48]
    });
    let lng2Marker = L.marker(this.state.currentPoint, {
      icon: latIcon
    }).addTo(this.map);

    this.setState({
      lng2Marker: lng2Marker
    });
  };

  onStopTimeChanged = e => {
    this.setState({
      tripStopTime: e.target.value
    });
  };

  handletoggle = e => {
    if (e.target.checked) {
      this.setState({
        tripIsTwoWay: 1
      });
    } else {
      this.setState({
        tripIsTwoWay: 0
      });
    }
  };

  getPrice = async e => {
    if (this.state.latPoint.length == 0 || this.state.lngPoint.length == 0) {
      return;
    }
    //get price
    try {
      let priceRes = await axios({
        method: "post",
        url: config.app.BASE_URL + "panel/trip/price",
        headers: {
          Authorization: `Bearer ${db.get("token").value()}`,
          "Content-Type": "application/json"
        },
        data: {
          start: { coordinates: this.state.latPoint },
          ends: [{ coordinates: this.state.lngPoint }],
          options: {
            isTwoWay: this.state.tripIsTwoWay,
            stopTime: this.state.tripStopTime
          },
          tripType:this.state.tripType,
          carType:this.state.carType
        }
      });

      if (priceRes.data.status == 200) {
        this.setState({
          tripCost: priceRes.data.price
        });
      }
    } catch (e) {}
  };

  onCarTypeChanged = (e)=>{

    let tripType = 0;

    if(e.target.value == 0){
      tripType=0;//taxi
    }
    else if(e.target.value == 1){
      tripType=1;//female
    }else{
      tripType=2//reserve
    }

    this.setState({
      carType: e.target.value,
      tripType
    });
  }

  onPassengerIdChanged = async (e)=>{
    

    this.setState({
      passengerId:e.target.value
    });
    
    if(e.target.value.length === 11){
      try {
        let getPassengerReq = await axios({
          method: "post",
          url: config.app.BASE_URL + "panel/passenger/by/phonenumber",
          headers: {
            Authorization: `Bearer ${db.get("token").value()}`,
            "Content-Type": "application/json"
          },
          data: {
            phoneNumber:e.target.value
          }
        });

        this.setState({
          isNewPassenger:true
        });

        if (getPassengerReq.data.status === 200) {
          this.setState({
            passengerFullName:getPassengerReq.data.passenger.name
          });

        }else{
          this.setState({
            passengerFullName:""
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    }else{
      this.setState({
        isNewPassenger:false
      });
    }
   

    



  }

  onpassengerFullNameChanged = (e)=>{
    this.setState({
      passengerFullName:e.target.value
    });
  }

  onTripRequest = async(e)=>{



    if(!this.state.passengerId ||
     !this.state.latPoint|| !this.state.lngPoint ||
      !this.state.nearDriver.phoneNumber||
     this.state.carType === null||
      this.state.tripType === null||
        this.state.tripIsTwoWay === null||
        this.state.tripStopTime === null){
          return;
    }

    let ends = [];

    if(this.state.lngPoint.length == 2){
      ends[0] ={coordinates:this.state.lngPoint,address:this.state.lngAddress}
    }
    if(this.state.lng2Point.length == 2){
      ends[1] = {coordinates:this.state.lng2Point,address:this.state.lng2Address}
    }

    try {
      let tripReqRes = await axios({
        method: "post",
        url: config.app.BASE_URL + "panel/trip/request",
        headers: {
          Authorization: `Bearer ${db.get("token").value()}`,
          "Content-Type": "application/json"
        },
        data: {
          passengerId:this.state.passengerId,
          passengerFullName:this.state.passengerFullName,
          start:{coordinates:this.state.latPoint,address:this.state.latAddress},
          ends:ends,
          driverPhoneNumber:this.state.nearDriver.phoneNumber,
          carType:this.state.carType,
          tripType:this.state.tripType,
          options:{
            isTwoWay:this.state.tripIsTwoWay,
            stopTime:this.state.tripStopTime
          }
        }
      });
   

      if (tripReqRes.data.status == 200) {

        return this.setState({
          alert:{
            status:true,
            message:tripReqRes.data.message
          }
        });

      }
      this.setState({
        alert:{
          status:true,
          message:tripReqRes.data.message
        }
        
      });
    } catch (e) {
      this.setState({
        alert:{
          status:true,
          message:e.message
        }
       
      });
    }


   
       
  }

  render() {
    return (
      <Container className="ltr">
        <div id="tripRequestMap">


        </div>

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
            <div className="card pt-4 pl-2">
              <ul>
                <li>            <p>با کلیک کردن روی نقشه موقعیت مورد نظر خود را پیدا کنید سپس با زدن روی دکمه "ثبت این مکان" آن نقطه را به عنوان مبدا یا مقصد تعیین کنید</p>
</li>
<li>      <p>برای انتخاب راننده بر روی آیکون آنها بر روی نقشه کلیک کنید</p>
</li>
<li>      <p>جهت گرفتن تاکسی برای مسافرینی که در زپ عضو نیستند کافیست شماره همراه آنها را در فیلد مربوطه وارد کنید سپس فیلد نام را تکمیل کنید تا همزمان با درخواست ثبت نام شوند</p>
</li>
              </ul>

            </div>
     

        <Row className="topMargin5 temp">
          <Col md={{ size: 10 }} className="centerizeCard">
            <Card className="bg-light shadow border-0 ">
              <CardHeader className="PrimaryColor">موقعیت یابی</CardHeader>
              <CardBody>
                <Row className="withdivider" />

                <Row className="mt-4 mb-4">
                  <Col>




                  <Label className="d-block mr-sm-2">
                          نوع خودرو
                        </Label>

                        <Input
                          type="select"
                          value={this.state.carType}
                          onChange={this.onCarTypeChanged}
                          className="text-right"
                        >
                          <option value={0}>تاکسی زپ</option>
                          <option value={1}>تاکسی بانوان زپ</option>
                          <option value={8}>پیک زپ</option>
                          <option value={6}>وانت زپ</option>
                          <option value={2}>ون زپ</option>
                          <option value={7}>امداد خودرو زپ</option>
                          <option value={4}>کامیون زپ</option>
                         
                        </Input>








                    <Label for="exampleEmail" className="d-block mt-4 mr-sm-2">
                      :آدرس
                    </Label>
                    <Input
                      type="text"
                      name="currentAddress"
                      id="currentAddress"
                      className="text-right"
                      value={this.state.currentAddress}
                    ></Input>

                    <Button
                      className="mt-4 btn-dark"
                      onClick={this.onLng2AddressClicked}
                    >
                      ثبت این مکان به عنوان مقصد دوم
                    </Button>

                    <Button
                      className="mt-4 mr-4 btn-dark"
                      onClick={this.onLngAddressClicked}
                    >
                      ثبت این مکان به عنوان مقصد
                    </Button>

                    <Button
                      className="mt-4 mr-4 btn-dark"
                      onClick={this.onLatAddressClicked}
                    >
                      ثبت این مکان به عنوان مبدا
                    </Button>
                  </Col>
                </Row>

                <Row className="mt-4 mb-4">
                  <Col>
                    <p className="d-inline-block ml-2">
                      {this.state.latAddress
                        ? this.state.latAddress
                        : "نقطه ای به عنوان مبدا تعیین نشده است"}
                    </p>

                    <Label className="d-inline-block">:مبدا</Label>
                  </Col>
                </Row>

                <Row className="mt-4 mb-4">
                  <Col>
                    <p className="d-inline-block ml-2">
                      {this.state.lngAddress
                        ? this.state.lngAddress
                        : "نقطه ای به عنوان مقصد ثبت نشده است"}
                    </p>

                    <Label className="d-inline-block">:مقصد</Label>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="bg-light shadow border-0 ">
              <CardHeader className="PrimaryColor">اطلاعات مسافر</CardHeader>
              <CardBody>
                <Row className="withdivider" />

                <Row className="mt-4 mb-4">
                  <Col>

                  <div className={this.state.isNewPassenger?"d-block":"d-none"}>
                        <Label className="d-block mr-sm-2">
                        :نام و نام خانوادگی
                      </Label>
                      <Input
                        type="text"
                        name="fullname"
                        id="fullname"
                        className="text-right"
                        onChange={this.onpassengerFullNameChanged}
                        value={this.state.passengerFullName}
                      ></Input>
                        </div>



                    <div>
                    
                       
                 


                      <Label for="exampleEmail" className="d-block mr-sm-2">
                        :شماره همراه یا شماره اشتراک مسافر
                      </Label>
                      <Input
                        type="text"
                        name="passengerId"
                        id="passengerId"
                        className="text-right"
                        onChange={this.onPassengerIdChanged}
                        value={this.state.passengerId}
                      ></Input>






                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="bg-light shadow border-0 ">
              <CardHeader className="PrimaryColor">اطلاعات راننده</CardHeader>
              <CardBody>
                <Row className="withdivider" />

                <Row className="mt-4 mb-4">
                  <Col>
                    <div
                      className={
                        this.state.isDriverSelected ? "d-block" : "d-none"
                      }
                    >
                      <div className="d-inline-block p-2 m-2">
                        <p className="badge badge-info d-inline-block ml-2">
                          {this.state.nearDriver
                            ? this.state.nearDriver.phoneNumber
                            : "بدون نام"}
                        </p>
                      </div>

                      <div className="d-inline-block p-2 m-2">
                        <p className="d-inline-block ml-2">
                          {this.state.nearDriver
                            ? this.state.nearDriver.car.name +
                              " " +
                              this.state.nearDriver.car.color +
                              " با پلاک: " +
                              this.state.nearDriver.car.plate
                            : "بدون نام"}
                        </p>
                      </div>

                      <div className="d-inline-block p-2 m-2">
                        <p className="d-inline-block ml-2">
                          {this.state.nearDriver
                            ? this.state.nearDriver.name
                            : "بدون نام"}
                        </p>
                      </div>

                      <img
                        width="64px"
                        height="64px"
                        className="d-inline-block"
                        src={
                          config.app.DRIVER_IMAGE_URL +
                          this.state.nearDriver.avatar
                        }
                        alt="عکس راننده"
                      ></img>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="bg-light shadow border-0 ">
              <CardHeader className="PrimaryColor">اطلاعات تکمیلی</CardHeader>
              <CardBody>
                <Row className="withdivider" />

                <Row className="mt-4 mb-4">
                  <Col>
                    <div>
                      <div className="d-inline-block p-2 m-2">
                        <Label for="exampleEmail" className="d-block mr-sm-2">
                          :هزینه
                        </Label>
                        <button
                          className="badge badge-info d-inline-block ml-2"
                          onClick={this.getPrice}
                        >
                          استعلام هزینه
                        </button>
                        <p className="badge badge-dark d-inline-block ml-2">
                          {this.state.tripCost
                            ? this.state.tripCost + " تومان "
                            : "0 تومان"}
                        </p>
                      </div>

                      <div className="d-inline-block p-2 m-2">
                        <Label for="exampleEmail" className="d-block mr-sm-2">
                          :رفت و برگشتی
                        </Label>

                        <div>
                          <label className="switch">
                            <input
                              defaultChecked={this.state.isActive}
                              type="checkbox"
                              onChange={this.handletoggle}
                            />
                            <span className="slider round" />
                          </label>
                        </div>
                      </div>

                      <div className="d-inline-block p-2 m-2">
                        <Label for="exampleEmail" className="d-block mr-sm-2">
                          (به دقیقه):توقف در مسیر
                        </Label>

                        <Input
                          type="select"
                          value={this.state.tripStopTime}
                          onChange={this.onStopTimeChanged}
                        >
                          <option value={5}>0-5</option>
                          <option value={10}>5-10</option>
                          <option value={15}>10-15</option>
                          <option value={20}>15-20</option>
                          <option value={25}>20-25</option>
                          <option value={30}>25-30</option>
                          <option value={45}>30-45</option>
                          <option value={60}>45-60</option>
                        </Input>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Button
            onClick={this.onTripRequest}
              className={
                this.state.isDriverSelected
                  ? "d-block btn-info m-auto btn-lg w-100"
                  : "d-none"
              }
            >
              ثبت درخواست
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default withLeaflet(TripReuqest);

