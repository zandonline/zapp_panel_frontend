import React, { Component } from "react";
import L from "leaflet";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";
import { Link } from "react-router-dom";
import config from "../config";
import db from "../helpers/localDB";
import axios from "axios";

class PriceRuleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: {
        status: false,
        message: ""
      }
    };
  }
  componentDidMount() {
    this.map = L.map(this.props.data.id, {
      center: this.props.data.areaPolygon[0][0],
      zoom: this.props.mapZoom,
    });
    // add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(this.map);

    
    L.polygon(this.props.data.areaPolygon, { color: "red" }).addTo(this.map);

    if (this.props.markerPosition !== undefined) {
      L.marker(this.props.markerPosition).addTo(this.map);
    }
  }

  async handleActiveBtn(m, e) {
    try {
      let result = await axios({
        method: "delete",
        url: config.app.BASE_URL + "area/price/rules",
        headers: { Authorization: `Bearer ${db.get("token").value()}` },
        data: { areaId: m, active: 1 }
      });

      if (result.data.status === 200) {
        this.props.loadMaps();
      }

      this.setState({
        alert: {
          status: true,
          message: result.data.message
        }
      });
    } catch (e) {
      this.setState({
        alert: {
          status: true,
          message: "خطایی پیش آمده است"
        }
      });
    }
  }

  async handleDeleteBtn(m, e) {
    try {
      let result = await axios({
        method: "delete",
        url: config.app.BASE_URL + "area/price/rules",
        headers: { Authorization: `Bearer ${db.get("token").value()}` },
        data: { areaId: m, active: 0 }
      });

      if (result.data.status === 200) {
        this.props.loadMaps();
      }

      this.setState({
        alert: {
          status: true,
          message: "محدوده با موفقیت حذف شد"
        }
      });
    } catch (e) {
      this.setState({
        alert: {
          status: true,
          message: "خطایی پیش آمده است"
        }
      });
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

  render() {
    return (
      <div className="mt-4 mb-4">
        <Modal isOpen={this.state.alert.status} toggle={this.handleAlertBtn}>
          <ModalBody>{this.state.alert.message}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleAlertBtn}>
              باشه
            </Button>{" "}
          </ModalFooter>
        </Modal>

        <Row>
          <Col>
            <div className="individualMap ltr" id={this.props.data.id} />
          </Col>
        </Row>
        <Card
          key={this.props.data.id}
          className="bg-light shadow border-0 mrginTop"
        >
          <CardBody>
            <Row>
              <Col>
                <div className="table-responsive">
                  <table className="table align-items-center table-light">
                    <thead className="thead-primary">
                      <tr>
                        <th scope="col">شهر</th>
                        <th scope="col">نام محدوده</th>
                        <th scope="col">قیمت به ازای هر کیلومتر</th>
                        <th scope="col">قیمت ثابت</th>
                        <th scope="col">حداکثر محدوده قیمت ثابت</th>
                        <th scope="col">درصد هزینه رفت و برگشتی</th>
                        <th scope="col">
                          مقدار هزینه توقف در مسیر در هر 5 دقیقه
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">{this.props.data.city}</th>

                        <th scope="row">{this.props.data.title}</th>

                        <th scope="row">
                          {this.props.data.defaultCost.costPerKm}
                        </th>
                        <th scope="row">
                          {this.props.data.defaultCost.constantCost}
                        </th>
                        <th scope="row">
                          {this.props.data.defaultCost.maxDistance}
                        </th>
                        <th scope="row">
                          {this.props.data.defaultCost.twoWayPercent}
                        </th>
                        <th scope="row">
                          {this.props.data.defaultCost.stopTimeCost}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Row>
                  <Link
                    to={{ pathname: "rules/add", state: this.props.data }}
                    className="btn btn-link topMargin2 ml-2"
                  >
                    ویرایش{" "}
                  </Link>

                  <Link
                    to={{
                      pathname: "rules/toArea/add",
                      state: this.props.data
                    }}
                    className="btn btn-link topMargin2 ml-2"
                  >
                    قیمت گذاری برون شهری{" "}
                  </Link>

                  <button
                    onClick={this.handleActiveBtn.bind(
                      this,
                      this.props.data.id
                    )}
                    type="button"
                    className="btn btn-link topMargin2 ml-3"
                  >
                    {this.props.data.isActive
                      ? "غیر فعال کردن محدوده"
                      : "فعال کردن محدوده"}
                  </button>

                  <button
                    onClick={this.handleDeleteBtn.bind(
                      this,
                      this.props.data.id
                    )}
                    type="button"
                    className="btn btn-warning topMargin2 ml-3"
                  >
                    حذف محدوده
                  </button>
                </Row>
                {/* <Row className="mt-4">
                        <FormGroup className="ml-3" check>
                          <Label check>
                            <Input
                              type="checkbox"
                              onChange={this.onSelectArea.bind(this, item.id)}
                            />
                            انتخاب محدوده
                          </Label>
                        </FormGroup>
                      </Row> */}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>
    );
  }
}

PriceRuleMap.propTypes = {
  mapPosition: PropTypes.arrayOf(PropTypes.number),
  mapZoom: PropTypes.number,
  markerPosition: PropTypes.arrayOf(PropTypes.number)
};

PriceRuleMap.defaultProps = {
  mapPosition: [35.7, 51.4],
  mapZoom: 9
};

export default PriceRuleMap;
