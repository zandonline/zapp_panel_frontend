import React, { Component } from "react";
import L from "leaflet";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";
import config from "../config";
import db from "../helpers/localDB";
import axios from "axios";

class PriceRuleToAreaMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false
    };
  }
  componentDidMount() {
    try {
      this.map = L.map(this.props.data.id, {
        center: this.props.data.area[0],
        zoom: this.props.mapZoom
      });

      // add the OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
      }).addTo(this.map);

      L.polygon(this.props.data.area, { color: "red" }).addTo(this.map);

      if (this.props.markerPosition !== undefined) {
        L.marker(this.props.markerPosition).addTo(this.map);
      }
    } catch (e) {}
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  handleDeleteBtn = async e => {
    try {
      let result = await axios({
        method: "delete",
        url: config.app.BASE_URL + "area/price/rules/toArea",
        data: {
          areaId: this.props.areaId,
          toAreaId: this.props.data.id
        },
        headers: { Authorization: `Bearer ${db.get("token").value()}` }
      });

      if (result.data.status === 200) {
        this.props.history.push("/agent/price/rules");
        // this.setState({
        //   modal: true,
        //   message: result.data.message
        // });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  render() {
    return (
      <div className="mt-4">
        <Row>
          <Col>
            <div className="individualMap ltr" id={this.props.data.id} />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="table-responsive">
              <table className="table align-items-center table-light">
                <thead className="thead-primary">
                  <tr>
                    <th scope="col">قیمت</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{this.props.data.cost}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <button
              onClick={this.handleDeleteBtn.bind(this, this.props.data.id)}
              type="button"
              className="btn btn-warning topMargin2"
            >
              حذف
            </button>
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
      </div>
    );
  }
}

PriceRuleToAreaMap.propTypes = {
  mapPosition: PropTypes.arrayOf(PropTypes.number),
  mapZoom: PropTypes.number,
  markerPosition: PropTypes.arrayOf(PropTypes.number)
};

PriceRuleToAreaMap.defaultProps = {
  mapPosition: [35.7, 51.4],
  mapZoom: 9
};

export default PriceRuleToAreaMap;
