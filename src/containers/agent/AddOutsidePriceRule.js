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
  Input
} from "reactstrap";
import axios from "axios";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

import config from "../../config";
import db from "../../helpers/localDB";
import geolib from "geolib";

var currentPoints = [];
let mapPolygons = [];
let selectedArea = [];
let lastPol = null;

class AddOutsidePriceRule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      cost: 0,
      areaId: "",
      areaPolygon: [],
      constantCost: [],
      cityId: ""
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  componentDidMount() {
    const m = this.props.location.state;

    this.map = L.map("map", {
      center: !m ? this.props.mapPosition : m.areaPolygon[0][0],
      zoom: this.props.mapZoom,
    })
    
    
    // add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(this.map);

    
    this.map.on("click", function(e) {
      for (let mapPolygon of mapPolygons) {
        mapPolygon.setStyle({ color: "black" });
      }

      for (let mapPolygon of mapPolygons) {
        if (
          geolib.isPointInside(
            { latitude: e.latlng.lat, longitude: e.latlng.lng },
            mapPolygon._latlngs[0]
          )
        ) {
          //check only one area selected
          // if(selectedArea.length <1){

          if (mapPolygon.options.color !== "blue") {
            selectedArea.push(mapPolygon);
            mapPolygon.setStyle({ color: "blue" });
          }

          // if (mapPolygon.options.color === "blue") {
          //   selectedArea = selectedArea.filter(_selectedArea => {
          //     return _selectedArea._leaflet_id !== mapPolygon._leaflet_id;
          //   });
          //   mapPolygon.setStyle({ color: "black" });
          // } else {
          //   selectedArea.push(mapPolygon);
          //   mapPolygon.setStyle({ color: "blue" });
          // }

          // }

          return;
        }
      }
    });

    if (m !== undefined) {
      this.setState({
        areaId: m.id,
        areaPolygon: m.areaPolygon[0],
        defaultCost: m.defaultCost,
        cityId: m.cityId
      });

      currentPoints = m.areaPolygon[0];
      currentPoints.push(currentPoints[0]);

      //create area from current points

      for (let otherArea of m.otherAreas) {
        if (otherArea.is_active === 1) {
          let poly = L.polygon(otherArea.location.coordinates, {
            color: "black"
          }).addTo(this.map);

          mapPolygons.push(poly);
        }
      }
    }

    lastPol = L.polygon(currentPoints, { color: "red" }).addTo(this.map);

    // if(this.props.markerPosition !== undefined){
    //     L.marker(this.props.markerPosition).addTo(this.map);
    // }
  }

  handleCostInput = e => {
    this.setState({
      cost: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    let toAreaArea = [];
    for (let areaPol of selectedArea[0]._latlngs[0]) {
      toAreaArea.push([areaPol.lat, areaPol.lng]);
    }

    toAreaArea.push([
      selectedArea[0]._latlngs[0][0].lat,
      selectedArea[0]._latlngs[0][0].lng
    ]);

    let toAreasCost = [
      {
        area: toAreaArea,
        cost: this.state.cost
      }
    ];

    const Formdata = {
      areaId: this.state.areaId ? this.state.areaId : "",
      areaPolygon: this.state.areaPolygon,
      defaultCost: {
        constantCost: this.state.defaultCost.constantCost,
        perKmCost: this.state.defaultCost.costPerKm,
        maxDistance: this.state.defaultCost.maxDistance,
        twoWayPercent: this.state.defaultCost.twoWayPercent
      },
      cityId: this.state.cityId,
      toAreasCost
    };
    axios({
      method: "post",
      url: config.app.BASE_URL + "area/price/rules",
      headers: { Authorization: `Bearer ${db.get("token").value()}` },
      data: Formdata
    })
      .then(res => {
        this.setState({
          modal: true,
          message: res.data.message
        });
        // if (res.data.status === 200) {
        //     this.props.history.push("/agent/price/rules");
        //   }
      })
      .catch(e => {
        this.setState({
          modal: true,
          message: e.message
        });
      });
  };

  render() {
    return (
      <Container className="hideOverflow ltr">
        <div id={"map"} />

        <Row className="topMargin5 temp">
          <Col md={{ size: 10 }} className="centerizeCard">
            <p>
              
              محدوده مورد نظر را بر روش نقشه انتخاب کنید تا به رنگ آبی و حالت
              انتخاب دربیاید
            </p>
            <p>
              در صورتی که با کلیک روی محدوده ی مشکی رنگ به حالت انتخاب و آبی در
              نیامد صفحه را رفرش کنید
              *
            </p>
            <p>
              از قسمت "ویرایش" یک محدوده، تمام قیمت گذاری های برون شهری آن قابل مشاهده است
              *
            </p>
            <Card className="bg-light shadow border-0 ">
              <CardHeader className="PrimaryColor">قیمت گذاری</CardHeader>

              <CardBody>
                <Form onSubmit={this.handleSubmit}>
                  <Row className="mt-4 mb-4">
                    <Col>
                      <Label for="exampleEmail" className="d-block mr-sm-2">
                        مبلغ هزینه بین دو محدوده
                      </Label>
                      <Input onChange={this.handleCostInput} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={{ size: 7, offset: 5 }}>
                      <button
                        type="submit"
                        className="topMargin2 btn btn-info PrimaryColor"
                      >
                        ثبت قیمت
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

AddOutsidePriceRule.propTypes = {
  mapPosition: PropTypes.arrayOf(PropTypes.number),
  mapZoom: PropTypes.number,
  markerPosition: PropTypes.arrayOf(PropTypes.number)
};

AddOutsidePriceRule.defaultProps = {
  mapPosition: [29.5, 52.5],
  mapZoom: 12,
  markerPosition: [29.5, 52.5]
  // [35.7, 51.4]
};

export default withRouter(AddOutsidePriceRule);
