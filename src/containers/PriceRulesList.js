import React, { Component } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Container,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { Link } from "react-router-dom";
import PriceRuleMap from "./PriceRuleMap";
import config from "../config";
import db from "../helpers/localDB";

class PriceRulesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapList: [],
      priceData: {},
      page: 1,
      selectedArea: [],
      isSelectedTwoArea: false,
      commision: 0,
      alert: {
        status: false,
        message: ""
      }
    };
    this.loadMaps();
  }



  async loadMaps(page = 1) {

    try {
      let result = await axios({
        method: "get",
        url: config.app.BASE_URL + "area/price/rules?page=" + page,
        headers: { Authorization: `Bearer ${db.get("token").value()}` }
      });
      if (result.data.status === 200) {
        this.setState({ 
          mapList: result.data.areas,
          commision:result.data.agentCommision?result.data.agentCommision:15
         });
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  handleNextBtn = e => {
    e.preventDefault();

    let currentPage = this.state.page + 1;

    if (currentPage >= 1 && this.state.mapList.length > 0) {
      this.setState({
        page: currentPage
      });

      this.loadMaps(currentPage);
    }
  };

  handlePrevBtn = e => {
    e.preventDefault();
    let currentPage = this.state.page - 1;

    if (currentPage >= 1) {
      this.setState({
        page: currentPage
      });

      this.loadMaps(currentPage);
    }
  };
  handleAlertBtn = () => {
    this.setState({
      alert: {
        status: false,
        message: ""
      }
    });
  };

  handleToAreaBtn = e => {
    e.preventDefault();
    this.props.history.push("rules/toarea");
  };

  onSelectArea = (id, e) => {
    if (!e.target.checked) {
      let newSelectedArea = this.state.selectedArea.filter(item => {
        return item !== id;
      });

      this.setState({
        selectedArea: newSelectedArea
      });
      if (this.state.selectedArea.length === 2) {
        this.setState({
          isSelectedTwoArea: false
        });
      }
    } else {
      this.setState({
        selectedArea: [...this.state.selectedArea, id]
      });
      if (this.state.selectedArea.length === 1) {
        this.setState({
          isSelectedTwoArea: true
        });
      }
      if (this.state.selectedArea.length > 1) {
        this.setState({
          alert: {
            status: true,
            message: "مجاز به انتخاب بیشتر از دو محدوده نیستید"
          }
        });
      }
    }
  };

  async handleActiveBtn(m, e) {
    try {
      let result = await axios({
        method: "delete",
        url: config.app.BASE_URL + "area/price/rules",
        headers: { Authorization: `Bearer ${db.get("token").value()}` },
        data: { areaId: m, active: true }
      });

      if (result.data.status === 200) {
        this.setState({
          alert: {
            status: true,
            message: result.data.message
          }
        });
        this.loadMaps();
      }
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
        data: { areaId: m, active: false }
      });

      if (result.data.status === 200) {
        this.setState({
          alert: {
            status: true,
            message: "محدوده با موفقیت حذف شد"
          }
        });
        this.loadMaps();
      }
    } catch (e) {
      this.setState({
        alert: {
          status: true,
          message: "خطایی پیش آمده است"
        }
      });
    }
  }

  onComissionChange = async event => {
    if (event.target.value.length == 2 || event.target.value.length == 1) {
      let value = event.target.value;

      this.setState({
        commision: value
      });
      try {
        let result = await axios({
          method: "post",
          url: config.app.BASE_URL + "agent/city/commision",
          headers: { Authorization: `Bearer ${db.get("token").value()}` },
          data: { commision: event.target.value }
        });

        if (result.data.status === 200) {
          this.setState({
            alert: {
              status: true,
              message: "کارمزد با موفقیت تغییر کرد"
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
    }
  };

  render() {
    return (
      <Container>
        <Modal isOpen={this.state.alert.status} toggle={this.handleAlertBtn}>
          <ModalBody>{this.state.alert.message}</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleAlertBtn}>
              باشه
            </Button>{" "}
          </ModalFooter>
        </Modal>

        <Row>
          <Col className="col-md-3 m-3">
            <Link
              to={{ pathname: "rules/add" }}
              className="topMargin2 btn btn-danger"
            >
              {" "}
              افزودن محدوده جدید{" "}
            </Link>
          </Col>
          <div className="col-md-3 offset-md-5 mt-3 col">
            <p>نرخ کارمزد:(درصد)</p>

            <input
              type="text"
              className="form-control"
              value={this.state.commision}
              onChange={this.onComissionChange}
            />
          </div>
        </Row>

        <Row className="temp">
          <Col md={{ size: 12 }}>
            {this.state.mapList.map(item => (
              <PriceRuleMap key={item.id} data={item} loadMaps={() => this.loadMaps()} />
            ))}

            <div className="m-auto d-block mt-3">
              <button
                id="nextBtn"
                className={
                  this.state.page + 1 >= 1 && this.state.mapList.length > 0
                    ? "m-2 btn btn-primary"
                    : "d-none"
                }
                onClick={this.handleNextBtn}
              >
                صفحه بعد
              </button>
              <span className="Mypagination">{this.state.page}</span>
              <button
                id="prevBtn"
                className={
                  this.state.page - 1 >= 1 ? "m-2 btn btn-primary" : "d-none"
                }
                onClick={this.handlePrevBtn}
              >
                صفحه قبل
              </button>
            </div>
          </Col>
        </Row>

        {this.state.isSelectedTwoArea ? (
          <div className="fixed-bottom shadow p-3 bg-white rounded">
            <Row>
              <p className="col-sm-10">
                آیا میخواهید برای دو محدوده قیمت گذاری کنید؟
              </p>
              <button
                className="col-sm-2 btn btn-warning"
                onClick={this.handleToAreaBtn}
              >
                افزودن قیمت
              </button>
            </Row>
          </div>
        ) : null}
      </Container>
    );
  }
}
export default PriceRulesList;
