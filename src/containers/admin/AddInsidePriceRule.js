import React, { Component } from "react";
import L from "leaflet";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
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
  FormGroup,
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
class AddInsidePriceRule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textValue: 200,
      textValue2: 200,
      textValue3: 1,
      twoWayPercent: 1,
      areaId: "",
      cityId: null,
      modal: false,
      message: "",
      citys: [],
      city: ""
    };
    this.loadcities();
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
  onSlide2 = (render, handle, value, un, percent) => {
    this.setState({
      textValue2: value[0].toFixed(0)
    });
  };
  onSlide3 = (render, handle, value, un, percent) => {
    this.setState({
      textValue3: value[0].toFixed(0)
    });
  };

  ontwoWayPercentSlideChange = (render, handle, value, un, percent) => {
    this.setState({
      twoWayPercent: value[0].toFixed(1)
    });
  };

  makePolygon = () => {
    if (points.length > 2) {
      currentPol = L.polygon(points, { color: "red" }).addTo(this.map);
      points.push(points[points.length - 1]);
      currentPoints = points;
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

  async loadcities() {
    try {
      let result = await axios({
        method: "get",
        url: config.app.BASE_URL + "city",
        headers: { Authorization: `Bearer ${db.get("token").value()}` }
      });
      if (result.data.status === 200) {
        this.setState({
          citys: result.data.cities
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  componentDidMount() {
    const m = this.props.location.state;

    this.map = L.map("map", {
      center: !m ? this.props.mapPosition : m.areaPolygon[0][0],
      zoom: this.props.mapZoom
    });

    // add the OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(this.map);

    this.map.on("click", function(e) {
      marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      points.push([e.latlng.lat, e.latlng.lng]);
      markers.push(marker);
    });

    if (m !== undefined) {
      this.setState({
        textValue: m.defaultCost.constantCost,
        textValue2: m.defaultCost.costPerKm,
        textValue3: m.defaultCost.maxDistance,
        twoWayPercent: m.defaultCost.twoWayPercent,
        areaId: m.id,
        cityId: m.cityId
      });

      currentPoints = m.areaPolygon[0];

      //create area from current points
      for (let otherArea of m.otherAreas) {
        if (otherArea.is_active === 1) {
          L.polygon(otherArea.location.coordinates, { color: "#333" }).addTo(
            this.map
          );
        }
      }
      lastPol = L.polygon(currentPoints, { color: "red" }).addTo(this.map);
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
  handleSubmit = e => {
    points.push(points[0]);
    e.preventDefault();

    const Formdata = {
      areaId: this.state.areaId ? this.state.areaId : "",
      areaPolygon: currentPoints,
      defaultCost: {
        constantCost: this.state.textValue,
        perKmCost: this.state.textValue2,
        maxDistance: this.state.textValue3,
        twoWayPercent: this.state.twoWayPercent
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

  handleCityInput = e => {
    e.preventDefault();
    this.setState({
      cityId: e.target.value
    });
  };

  render() {
    const { textValue, textValue2, textValue3, twoWayPercent } = this.state;
    return (
      <Container className="hideOverflow ltr">
        <div id={"map"} />

        <Row>
          <div className="shivehMapButtonContainer">
            <button
              onClick={this.makePolygon}
              className="topMargin2 btn btn-info PrimaryColor"
            >
              رسم پلیگن{" "}
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
                  <Row className="withdivider"></Row>
                  <Row className="mt-4 mb-4">
                    <Col>
                      <FormGroup>
                        <Label for="exampleSelect">شهر </Label>

                        <Input
                          type="select"
                          name="select"
                          onChange={this.handleCityInput}
                          id="selectTime"
                        >
                          {this.state.citys.map((item, index) => {
                            return (
                              <option
                                key={index}
                                value={item._id}
                                selected={item._id === this.state.cityId}
                              >
                                {item.name}
                              </option>
                            );
                          })}
                        </Input>
                      </FormGroup>
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
                        step={200}
                        range={{
                          min: [200],
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
                        حداکثر محدوده قیمت ثابت
                      </Label>
                      <small>
                        ابعاد محدوده ای بر اساس کیلومتر که میخواهید در آن قیمت
                        ثابت باشد
                      </small>
                      <Nouislider
                        connect
                        start={this.state.textValue3}
                        step={1}
                        range={{
                          min: [1],
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
                        step={200}
                        range={{
                          min: [200],
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
                        step={0.5}
                        range={{
                          min: [1],
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

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}></ModalHeader>
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
