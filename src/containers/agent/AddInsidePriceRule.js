import React, { Component } from "react";
import L from "leaflet";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import PriceRuleToAreaMap from "../../containers/PriceRuleToAreaMap";

//import PriceForm from './priceForm';
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
  Input
} from "reactstrap";
import axios from "axios";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

import config from "../../config";
import db from "../../helpers/localDB";

var markers = [];
var marker;
var points = [];
var currentPol = [];
var lastPol = [];
var currentPoints = [];
var popup = null;

// const Map = Mapir.setToken({
//   transformRequest: url => {
//     return {
//       url: url,
//       headers: {
//         "x-api-key":
//           "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYyMzdkYWUxNTRiODg3OTBjYWUzNTk0YmVmYWJkYmI3YzZlOGRmZDkyZjdmYzhkYWNjOGM3ZjA1YmI3Y2YzNmIxZDM5MmE0NTkxMDA5MTllIn0.eyJhdWQiOiI1MTkzIiwianRpIjoiZjIzN2RhZTE1NGI4ODc5MGNhZTM1OTRiZWZhYmRiYjdjNmU4ZGZkOTJmN2ZjOGRhY2M4YzdmMDViYjdjZjM2YjFkMzkyYTQ1OTEwMDkxOWUiLCJpYXQiOjE1NzU5ODE3MzQsIm5iZiI6MTU3NTk4MTczNCwiZXhwIjoxNTc4NDAwOTM0LCJzdWIiOiIiLCJzY29wZXMiOlsiYmFzaWMiXX0.VMSjHpeYmjZUozvgWBcv8ABSkY6cg1x-ULtwgVk5Cll1G68S9QPMaG-Zw-T3cKGXcVS5zfytPt1gAlRW6VE0hNEOSILquW87xLZ0HH_cysJyRVJnSiNT7E0OsRyE2_P9ru_wzyGV_sfAs4eiwkv1pgIDjTWP-DfulPlU1tdyTU4uLifJNYyyCabhzOs6ug1Mh3Z-tbmXoZCApAqwiz4eVpjwzuVbt3TxixT8kK1YLJ4tFLDMBPArqbJdUcapHRQslg-oV4MOOBqyjFw2QQZRWdzKuDcTDQy_-Y9Ub6oJMpWhjk4vtoyDhwktjWZYRxMobDPsGatCup5DVh0KIZLhxg", //Mapir access token
//         "Mapir-SDK": "reactjs"
//       }
//     };
//   }
// });

class AddInsidePriceRule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "بدون نام",
      textValue: 100,
      constNightValue:100,
      textValue2: 100,
      textValue3: 1,
      twoWayPercent: 0.25,
      stopTimeCost: 100,
      areaId: "",
      cityId: "",
      modal: false,
      message: "",
      citys: [],
      city: "",
      toAreasCost: [],
      carryCargo: {
        truck: 20000,
        van: 20000,
        pickup: 20000,
        sosPickup: 20000,
        motor: 20000
      },
      towConstCost:10000,
        towMaxConstCost:10,
        towPerKmCost:1000,
        towCarType:1,
        towRouteType:1,
    };
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };
  onSlide = (render, handle, value, un, percent) => {
    this.setState({
      textValue: value[0].toFixed(0)
    });
  };
  
  onSlideConstNightValue = (render, handle, value, un, percent) => {
    this.setState({
      constNightValue: value[0].toFixed(0)
    });
  };

  
  onSlide2 = (render, handle, value, un, percent) => {
    this.setState({
      textValue2: value[0].toFixed(0)
    });
  };
  onSlide3 = (render, handle, value, un, percent) => {
    this.setState({
      textValue3: value[0].toFixed(1)
    });
  };
  ontwoWayPercentSlideChange = (render, handle, value, un, percent) => {
    this.setState({
      twoWayPercent: value[0].toFixed(1)
    });
  };
  onStopTimeCostSlideChange = (render, handle, value, un, percent) => {
    this.setState({
      stopTimeCost: value[0].toFixed(0)
    });
  };
  onCarryCargoTruckSlideChange = (render, handle, value, un, percent) => {
    this.setState({
      carryCargo: {
        pickup: this.state.carryCargo.pickup,
        motor: this.state.carryCargo.motor,
        sosPickup: this.state.carryCargo.sosPickup,
        van: this.state.carryCargo.van,
        truck: value[0].toFixed(0)
      }
    });
  };
  onCarryCargoVanSlideChange = (render, handle, value, un, percent) => {
    this.setState({
      carryCargo: {
        pickup: this.state.carryCargo.pickup,
        motor: this.state.carryCargo.motor,
        sosPickup: this.state.carryCargo.sosPickup,
        van: value[0].toFixed(0),
        truck: this.state.carryCargo.truck
      }
    });
  };
  onCarryCargoPickupSlideChange = (render, handle, value, un, percent) => {
    this.setState({
      carryCargo: {
        pickup: value[0].toFixed(0),
        motor: this.state.carryCargo.motor,
        sosPickup: this.state.carryCargo.sosPickup,
        van: this.state.carryCargo.van,
        truck: this.state.carryCargo.truck
      }
    });
  };
  onCarryCargoSosPickupSlideChange = (render, handle, value, un, percent) => {
    this.setState({
      carryCargo: {
        motor: this.state.carryCargo.motor,
        pickup: this.state.carryCargo.pickup,
        sosPickup: value[0].toFixed(0),
        van: this.state.carryCargo.van,
        truck: this.state.carryCargo.truck
      }
    });
  };
  onCarryCargoMotorSlideChange = (render, handle, value, un, percent) => {
    this.setState({
      carryCargo: {
        motor: value[0].toFixed(0),
        pickup: this.state.carryCargo.pickup,
        sosPickup: this.state.carryCargo.sosPickup,
        van: this.state.carryCargo.van,
        truck: this.state.carryCargo.truck
      }
    });
  };

  makePolygon = () => {
    if (points.length > 2) {
      currentPol = L.polygon(points, { color: "red" }).addTo(this.map);
      points.push(points[points.length - 1]);
      currentPoints = points;
      // if (popup != null) {
      //   this.map.closePopup(popup);
      // }
      // if (this.state.title) {
      //   popup = L.popup()
      //     .setLatLng(points[0])
      //     .setContent(`<p>${this.state.title}</p>`)
      //     .openOn(this.map);
      // }
    }
  };
  reset = () => {
    if (lastPol) {
      this.map.removeLayer(lastPol);
    }
    if (currentPoints[0] && currentPoints.length >= 3) {
      this.map.removeLayer(currentPol);
    }

    if (markers.length > 0) {
      for (var i = 0; i < markers.length; i++) {
        this.map.removeLayer(markers[i]);
        currentPoints.splice(0, 1);
        points.splice(0, 1);
      }
    }
  };

  componentDidMount() {
    const m = this.props.location.state;



    this.map = new L.Map("map", {
      center: !m ? this.props.mapPosition : m.areaPolygon[0][0],
      zoom: this.props.mapZoom,
    });
      // add the OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }).addTo(this.map);

    this.map.on("click", e => {
      marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      points.push([e.latlng.lat, e.latlng.lng]);
      markers.push(marker);
    });

    if (m !== undefined) {
      this.setState({
        title: m.title,
        textValue: m.defaultCost.constantCost,
        constNightValue:m.defaultCost.constNightValue,
        textValue2: m.defaultCost.costPerKm,
        textValue3: m.defaultCost.maxDistance,
        twoWayPercent: m.defaultCost.twoWayPercent,
        stopTimeCost: m.defaultCost.stopTimeCost,
        carryCargo: m.defaultCost.carryCargo,
        areaId: m.id,
        cityId: m.cityId,
        toAreasCost: m.defaultCost.toAreasCost,
        towConstCost:m.defaultCost.towConstCost,
        towMaxConstCost:m.defaultCost.towMaxConstCost,
        towPerKmCost:m.defaultCost.towPerKmCost,
        towCarType:m.defaultCost.towCarType,
        towRouteType:m.defaultCost.towRouteType,
      });

      currentPoints = m.areaPolygon[0];

      //create area from current points
      lastPol = L.polygon(currentPoints, { color: "red" }).addTo(this.map);

      for (let otherArea of m.otherAreas) {
        if (otherArea.is_active === 1) {
          L.polygon(otherArea.location.coordinates, {
            color: "black"
          }).addTo(this.map);
        }
      }
    }

    // if(this.props.markerPosition !== undefined){
    //     L.marker(this.props.markerPosition).addTo(this.map);
    // }
  }

  setRadio = e => {
    this.setState({
      radio: e.target.value
    });
  };
  onTitleChange = e => {
    this.setState({
      title: e.target.value
    });
  };

  onChangeTowConstCost = (render, handle, value, un, percent) => {
    this.setState({
      towConstCost: value[0].toFixed(0)
    });
  };
  
  onChangeTowMaxConstCost = (render, handle, value, un, percent) => {
    this.setState({
      towMaxConstCost: value[0].toFixed(0)
    });
  };
  

  onChangeTowPerKmCost = (render, handle, value, un, percent) => {
    this.setState({
      towPerKmCost: value[0].toFixed(0)
    });
  };
  

  onChangeTowCarType = (render, handle, value, un, percent) => {
    this.setState({
      towCarType: value[0].toFixed(0)
    });
  };
  


  onChangeTowRouteType = (render, handle, value, un, percent) => {
    this.setState({
      towRouteType: value[0].toFixed(0)
    });
  };



  handleSubmit = e => {
    points.push(points[0]);
    e.preventDefault();

    const Formdata = {
      areaTitle: this.state.title ? this.state.title : "",
      areaId: this.state.areaId ? this.state.areaId : "",
      areaPolygon: currentPoints,
      defaultCost: {
        constantCost: this.state.textValue,
        constNightValue:this.state.constNightValue,
        perKmCost: this.state.textValue2,
        maxDistance: this.state.textValue3,
        twoWayPercent: this.state.twoWayPercent,
        stopTimeCost: this.state.stopTimeCost,
        carryCargo: this.state.carryCargo,
        tow:{
          constCost:this.state.towConstCost,
          maxConstCost:this.state.towMaxConstCost,
          perKmCost:this.state.towPerKmCost,
          carType:this.state.towCarType,
          routeType:this.state.towRouteType,
        }
      },
      cityId: this.state.cityId
    };
    axios({
      method: "post",
      url: config.app.BASE_URL + "area/price/rules",
      headers: { Authorization: `Bearer ${db.get("token").value()}` },
      data: Formdata
    })
      .then(res => {
        if (res.data.status === 200) {
          this.props.history.push("/agent/price/rules");
        }
        this.setState({
          modal: true,
          message: res.data.message
        });
      })
      .catch(e => {
        this.setState({
          modal: true,
          message: e.message
        });
      });
  };

  // handleCityInput = e => {
  //     e.preventDefault();

  //     console.log(e.target.value);
  //     this.setState({
  //         cityId: e.target.value
  //     });

  //   };

  render() {
    const {
      title,
      textValue,
      constNightValue,
      textValue2,
      textValue3,
      twoWayPercent,
      stopTimeCost,
      carryCargo,
      towConstCost,
      towMaxConstCost,
      towPerKmCost,
      towCarType,
      towRouteType
    } = this.state;

    return (
      <Container className="hideOverflow ltr">
        <div id="map"></div>

        <Row>
          <div className="shivehMapButtonContainer">
            <button
              onClick={this.makePolygon}
              className="topMargin2 btn btn-info PrimaryColor"
            >
              رسم محدوده{" "}
            </button>
            <button
              onClick={this.reset}
              className="topMargin2 btn btn-danger PrimaryColor ml-4"
            >
              پاک کردن{" "}
            </button>
          </div>
        </Row>
        {/* <button onClick={this.reset}>reset</button>  */}
        {/* <PriceForm ></PriceForm> */}
        <Row className="topMargin5 temp">
          <Col md={{ size: 10 }} className="centerizeCard">
            <Card className="bg-light shadow border-0 ">
              <CardHeader className="PrimaryColor">قیمت گذاری</CardHeader>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <Row className="withdivider" />
                  {/* <Row>
                                        <Col md='6'>
                                            <FormGroup>
                                            <Label for="exampleSelect">شهر </Label>
                                        
                                            <Input  type="select" name="select"  onChange={this.handleCityInput} id="selectTime">
                                            {this.state.citys.map((item,index)=>{
                                                return(
                                                <option key={index} value={item._id} >{item.name}</option>
                                            )}

                                            )}
                                            </Input>
                                            </FormGroup>
                                        </Col>
                                   </Row> */}

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="title" className="d-block mr-sm-2">
                        نام محدوده
                      </Label>
                      <small>یک نام دلخواه برای محدوده خود انتخاب کنید</small>
                      <Input
                        placeholder={title}
                        onChange={this.onTitleChange}
                      />
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <h3
                        className="d-block mr-sm-2 pt-4 pb-4"
                        style={{ color: "#9c27b0" }}
                      >
                        قیمت گذاری تاکسی زپ
                      </h3>
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="exampleEmail" className="d-block mr-sm-2">
                        قیمت ثابت
                      </Label>
                      <small>
                        هزینه محدوده ای که میخواهید در آن قیمت ثابت باشد
                      </small>
                      <Nouislider
                        connect
                        start={this.state.textValue}
                        step={100}
                        range={{
                          min: [100],
                          max: [10000]
                        }}
                        onSlide={this.onSlide}
                      />
                      {textValue && (
                        <div>
                          <p className="float-right">{textValue}</p>
                          <p className="float-right ml-2">تومان</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="exampleEmail" className="d-block mr-sm-2">
                       قیمت ثابت شبانه
                      </Label>
                      <small>
                        هزینه ثابت محدوده در شب بین ساعات 8 تا 6 صبح
                      </small>
                      <Nouislider
                        connect
                        start={this.state.constNightValue}
                        step={100}
                        range={{
                          min: [100],
                          max: [10000]
                        }}
                        onSlide={this.onSlideConstNightValue}
                      />
                      {constNightValue && (
                        <div>
                          <p className="float-right">{constNightValue}</p>
                          <p className="float-right ml-2">تومان</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="exampleEmail" className="d-block mr-sm-2">
                        حداکثر محدوده قیمت ثابت
                      </Label>
                      <small>
                        ابعاد محدوده ای بر اساس کیلومتر که میخواهید در آن قیمت
                        ثابت باشد
                      </small>
                      <Nouislider
                        connect
                        start={this.state.textValue3}
                        step={0.5}
                        range={{
                          min: [0.5],
                          max: [10]
                        }}
                        onSlide={this.onSlide3}
                      />
                      {textValue3 && (
                        <div>
                          <p className="float-right">{textValue3}</p>
                          <p className="float-right ml-2">کیلومتر</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="exampleEmail" className="d-block mr-sm-2">
                        قیمت به ازای هر کیلومتر
                      </Label>
                      <small>
                        خارج از محدوده ی قیمت ثابت هزینه بر اساس کیلومتر حساب
                        میشود
                      </small>
                      <Nouislider
                        connect
                        start={this.state.textValue2}
                        step={100}
                        range={{
                          min: [100],
                          max: [10000]
                        }}
                        onSlide={this.onSlide2}
                      />
                      {textValue2 && (
                        <div>
                          <p className="float-right">{textValue2}</p>
                          <p className="float-right ml-2">تومان</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="twoWayPercent" className="d-block mr-sm-2">
                        درصد هزینه رفت و برگشتی
                      </Label>
                      <small>
                        هزینه رفت و برگشت بر اساس این درصد ها محاسبه می شود
                      </small>
                      <Nouislider
                        connect
                        start={this.state.twoWayPercent}
                        step={0.25}
                        range={{
                          min: [0.25],
                          max: [3]
                        }}
                        onSlide={this.ontwoWayPercentSlideChange}
                      />
                      {twoWayPercent && (
                        <div>
                          <p className="float-right">{twoWayPercent}</p>
                          <p className="float-right ml-2">برابر</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="stopTimeCost" className="d-block mr-sm-2">
                        مقدار هزینه توقف در مسیر در هر 5 دقیقه
                      </Label>
                      <small>
                        هر 5 دقیقه توقف مقدار هزینه ای که به کل قیمت افزوده
                        میشود از این فیلد محسابه میشود
                      </small>
                      <Nouislider
                        connect
                        start={this.state.stopTimeCost}
                        step={100}
                        range={{
                          min: [100],
                          max: [2000]
                        }}
                        onSlide={this.onStopTimeCostSlideChange}
                      />
                      {stopTimeCost && (
                        <div>
                          <p className="float-right">{stopTimeCost}</p>
                          <p className="float-right ml-2">تومان</p>
                        </div>
                      )}
                    </Col>
                  </Row>




{/* //EMDAD */}


<Row className="mt-4 mb-4">
                    <Col>
                      <h3
                        className="d-block mr-sm-2 pt-4 pb-4"
                        style={{ color: "#9c27b0" }}
                      >
                        قیمت گذاری امداد زپ
                      </h3>
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="exampleEmail" className="d-block mr-sm-2">
                        قیمت اولیه
                      </Label>
                      <small>
                        هزینه اولیه که شامل هزینه آماده سازی و ورودی میشود
                      </small>
                      <Nouislider
                        connect
                        start={this.state.towConstCost}
                        step={100}
                        range={{
                          min: [100],
                          max: [100000]
                        }}
                        onSlide={this.onChangeTowConstCost}
                      />
                      {towConstCost && (
                        <div>
                          <p className="float-right">{towConstCost}</p>
                          <p className="float-right ml-2">تومان</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="exampleEmail" className="d-block mr-sm-2">
                        حداکثر محدوده قیمت ثابت
                      </Label>
                      <small>
                        ابعاد محدوده ای بر اساس کیلومتر که میخواهید در آن قیمت
                        ثابت باشد
                      </small>
                      <Nouislider
                        connect
                        start={this.state.towMaxConstCost}
                        step={0.5}
                        range={{
                          min: [0.5],
                          max: [20]
                        }}
                        onSlide={this.onChangeTowMaxConstCost}
                      />
                      {towMaxConstCost && (
                        <div>
                          <p className="float-right">{towMaxConstCost}</p>
                          <p className="float-right ml-2">کیلومتر</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="exampleEmail" className="d-block mr-sm-2">
                        قیمت به ازای هر کیلومتر
                      </Label>
                      <small>
                        خارج از محدوده ی قیمت ثابت هزینه بر اساس کیلومتر حساب
                        میشود
                      </small>
                      <Nouislider
                        connect
                        start={this.state.towPerKmCost}
                        step={100}
                        range={{
                          min: [100],
                          max: [100000]
                        }}
                        onSlide={this.onChangeTowPerKmCost}
                      />
                      {towPerKmCost && (
                        <div>
                          <p className="float-right">{towPerKmCost}</p>
                          <p className="float-right ml-2">تومان</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="twoWayPercent" className="d-block mr-sm-2">
                        نوع خودرو
                      </Label>
                      <small>
                        درصد هزینه اضافی برای خودرو های سنگین یا خارجی
                      </small>
                      <Nouislider
                        connect
                        start={this.state.towCarType}
                        step={1}
                        range={{
                          min: [1],
                          max: [200]
                        }}
                        onSlide={this.onChangeTowCarType}
                      />
                      {towCarType && (
                        <div>
                          <p className="float-right">{towCarType}</p>
                          <p className="float-right ml-2">درصد</p>
                        </div>
                      )}
                    </Col>
                  </Row>

           

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="stopTimeCost" className="d-block mr-sm-2">
                        نوع مسیر
                      </Label>
                      <small>
              درصد هزینه اضافی برای مسیر های کوهستانی و صعب العبور
                      </small>
                      

                      <Nouislider
                        connect
                        start={this.state.towRouteType}
                        step={1}
                        range={{
                          min: [1],
                          max: [200]
                        }}
                        onSlide={this.onChangeTowRouteType}
                      />
                      {towRouteType && (
                        <div>
                          <p className="float-right">{towRouteType}</p>
                          <p className="float-right ml-2">درصد</p>
                        </div>
                      )}

                    </Col>
                  </Row>




                  <Row className="mt-4 mb-4">
                    <Col>
                      <h3
                        className="d-block mr-sm-2 pt-4 pb-4"
                        style={{ color: "#9c27b0" }}
                      >
                        قیمت گذاری حمل بار
                      </h3>
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="carryCargoTruck" className="d-block mr-sm-2">
                        حمل بار توسط کامیون
                      </Label>
                      <small>هزینه حمل بار ساعتی</small>
                      <Nouislider
                        connect
                        start={this.state.carryCargo.truck}
                        step={1000}
                        range={{
                          min: [1000],
                          max: [100000]
                        }}
                        onSlide={this.onCarryCargoTruckSlideChange}
                      />
                      {carryCargo.truck && (
                        <div>
                          <p className="float-right">{carryCargo.truck}</p>
                          <p className="float-right ml-2">تومان</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="carryCargoVan" className="d-block mr-sm-2">
                        حمل بار توسط ون
                      </Label>
                      <small>هزینه حمل بار ساعتی</small>
                      <Nouislider
                        connect
                        start={this.state.carryCargo.van}
                        step={1000}
                        range={{
                          min: [1000],
                          max: [100000]
                        }}
                        onSlide={this.onCarryCargoVanSlideChange}
                      />
                      {carryCargo.van && (
                        <div>
                          <p className="float-right">{carryCargo.van}</p>
                          <p className="float-right ml-2">تومان</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="carryCargoPickup" className="d-block mr-sm-2">
                        حمل بار توسط وانت
                      </Label>
                      <small>هزینه حمل بار ساعتی</small>
                      <Nouislider
                        connect
                        start={this.state.carryCargo.pickup}
                        step={1000}
                        range={{
                          min: [1000],
                          max: [100000]
                        }}
                        onSlide={this.onCarryCargoPickupSlideChange}
                      />
                      {carryCargo.pickup && (
                        <div>
                          <p className="float-right">{carryCargo.pickup}</p>
                          <p className="float-right ml-2">تومان</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label
                        for="carryCargoSosPickup"
                        className="d-block mr-sm-2"
                      >
                        حمل بار توسط امداد خودرو
                      </Label>
                      <small>هزینه حمل بار ساعتی</small>
                      <Nouislider
                        connect
                        start={this.state.carryCargo.sosPickup}
                        step={1000}
                        range={{
                          min: [1000],
                          max: [100000]
                        }}
                        onSlide={this.onCarryCargoSosPickupSlideChange}
                      />
                      {carryCargo.sosPickup && (
                        <div>
                          <p className="float-right">{carryCargo.sosPickup}</p>
                          <p className="float-right ml-2">تومان</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="carryCargoMotor" className="d-block mr-sm-2">
                        حمل بار توسط پیک موتوری
                      </Label>
                      <small>هزینه حمل بار ساعتی</small>
                      <Nouislider
                        connect
                        start={this.state.carryCargo.motor}
                        step={1000}
                        range={{
                          min: [1000],
                          max: [100000]
                        }}
                        onSlide={this.onCarryCargoMotorSlideChange}
                      />
                      {carryCargo.motor && (
                        <div>
                          <p className="float-right">{carryCargo.motor}</p>
                          <p className="float-right ml-2">تومان</p>
                        </div>
                      )}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={{ size: 7, offset: 5 }}>
                      <button
                        type="submit"
                        className="topMargin2 btn btn-info PrimaryColor"
                      >
                        ارسال
                      </button>
                    </Col>
                  </Row>
                
                
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="topMargin5 temp">
          <Col md={{ size: 10 }} className="centerizeCard">
            <Card className="bg-light shadow border-0 ">
              <CardHeader className="PrimaryColor">
                قیمت گذاری های برون از این محدوده
              </CardHeader>
              <CardBody>
                <Row>
                  {this.state.toAreasCost.map(toArea => (
                    <Col key={toArea.id} md={{ size: 4 }}>
                      <PriceRuleToAreaMap
                        history={this.props.history}
                        data={toArea}
                        areaId={this.state.areaId}
                      />
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle} />
          <ModalBody>{this.state.message}</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.toggle}>
              بستن
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

AddInsidePriceRule.propTypes = {
  mapPosition: PropTypes.arrayOf(PropTypes.number),
  mapZoom: PropTypes.number,
  markerPosition: PropTypes.arrayOf(PropTypes.number)
};

AddInsidePriceRule.defaultProps = {
  mapPosition: [29.5, 52.5],
  mapZoom: 12,
  markerPosition: [29.5, 52.5]
  // [35.7, 51.4]
};

export default withRouter(AddInsidePriceRule);
