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
  Container
} from "reactstrap";
import axios from "axios";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

import config from "../config";
import db from "../helpers/localDB";

var markers = [];
var marker;
var points = [];
var currentPol = [];
var lastPol = [];
var currentPoints = [];
class ShivehMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textValue: 200,
      textValue2: 200,
      textValue3: 1,
      twoWayPercent: 0.1,
      areaId: "",
      cityId: null,
      modal: false,
      message: "",
      m: ""
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
      twoWayPercent: value[0].toFixed(0)
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

  componentDidMount() {
    const m = this.props.location.state;
    console.log(m);

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
        areaId: m.id,
        cityId: m.cityId
      });

      currentPoints = m.areaPolygon[0];

      //create area from current points
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
      areaId: this.state.areaId ? this.state.areaId : null,
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
  render() {
    const { textValue, textValue2, textValue3 } = this.state;
    return (
      <Container className="hideOverflow">
        <div id={"map"} />
        <Row>
          <div className="shivehMapButtonContainer">
            <button
              onClick={this.makePolygon}
              className="topMargin2 btn btn-default PrimaryColor"
            >
              رسم پلیگن{" "}
            </button>
            <button
              onClick={this.reset}
              className="topMargin2 btn btn-default PrimaryColor ml-4"
            >
              پاک کردن{" "}
            </button>
          </div>
        </Row>
        {/* <button onClick={this.reset}>reset</button>  */}
        {/* <PriceForm ></PriceForm> */}
        <Row className="topMargin5 temp">
          <Col md={{ size: 8, offset: 2 }}>
            <Card className="bg-light shadow border-0">
              <CardHeader className="PrimaryColor">قیمت گذاری</CardHeader>
              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <Row className="withdivider"></Row>
                  <Row>
                    <Col>
                      <Label for="exampleEmail" className="mr-sm-2">
                        قیمت ثابت
                      </Label>
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
                      {textValue && <div>{textValue} (تومان)</div>}
                    </Col>
                    <Col>
                      <Label for="exampleEmail" className="mr-sm-2">
                        قیمت به ازای هر کیلومتر
                      </Label>
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
                      {textValue2 && <div>{textValue2} (تومان)</div>}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Label for="exampleEmail" className="mr-sm-2">
                        حداکثر محدوده قیمت ثابت
                      </Label>
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
                      {textValue3 && <div>{textValue3} (کیلومتر)</div>}
                    </Col>
                  </Row>

                  <Row>
                    <Col md={{ size: 3, offset: 5 }}>
                      <button
                        type="submit"
                        className="topMargin2 btn btn-default PrimaryColor"
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

ShivehMap.propTypes = {
  mapPosition: PropTypes.arrayOf(PropTypes.number),
  mapZoom: PropTypes.number,
  markerPosition: PropTypes.arrayOf(PropTypes.number)
};

ShivehMap.defaultProps = {
  mapPosition: [35.7, 51.4],
  mapZoom: 10,
  markerPosition: [35.7, 51.4]
};

export default withRouter(ShivehMap);
