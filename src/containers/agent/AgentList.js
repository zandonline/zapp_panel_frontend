import React, { Component } from "react";
import axios from "axios";
import config from "../../config";
import db from "../../helpers/localDB";
import Search from "../mainSearch";
import City from '../city';
import {
  Table,
  Button,
  Badge,
  Container,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalFooter
} from "reactstrap";
class AgentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      agents: [],
      selectedCity: "",
      searchData: [],
      fiedls: [{ name: "شماره همراه" }],
      checkboxes: [
      ],
      alert: {
        status: false,
        message: ""
      },
      page: 1
    };

    this.loadAgents();
  }

  handleSearch = (searchData, statusList) => {
    this.setState({
      page: 1
    });
    this.setState({
      searchData: searchData,
      page: 1
    });
    this.loadAgents(this.state.page);
  };

  async loadAgents(page = 1) {
    try {
      let result = await axios({
        url: config.app.BASE_URL + "panel/index/agents?page=" + page,
        method: "post",
        headers: {
          Authorization: `Bearer ${db.get("token").value()}`,
          "Content-Type": "application/json"
        },
        data: {

          cityId: this.state.selectedCity,

          search: { phoneNumber: this.state.searchData[0] }


        },

      });

      if (result.data.status === 200) {
        if (result.data.agents.length === 0) {
          this.setState({
            agents: []
          });
        } else {
          this.setState({
            agents: result.data.agents
          });
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  handleNextBtn = e => {
    e.preventDefault();

    let currentPage = this.state.page + 1;

    if (currentPage >= 1 && this.state.agents.length > 0) {
      this.setState({
        page: currentPage
      });

      this.loadAgents(currentPage);
    }
  };

  handlePrevBtn = e => {
    e.preventDefault();
    let currentPage = this.state.page - 1;

    if (currentPage >= 1) {
      this.setState({
        page: currentPage
      });

      this.loadAgents(currentPage);
    }
  };

  handleBanBtn = async e => {
    try {
      let result = await axios({
        url: config.app.BASE_URL + "admin/agent/ban",
        method: "post",
        data: {
          phoneNumber: e.target.value
        },
        headers: {
          Authorization: `Bearer ${db.get("token").value()}`,
          "Content-Type": "application/json"
        }
      });

      if (result.data.status === 200) {
        this.setState({
          alert: {
            status: true,
            message: "کاربر با موفقیت بن شد"
          }
        });
      } else {
        this.setState({
          alert: {
            status: true,
            message: "خطایی پیش آمده است"
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

  handleAcceptBtn = async e => {
    try {
      let result = await axios({
        url: config.app.BASE_URL + "admin/agent/accept",
        method: "post",
        data: {
          phoneNumber: e.target.value
        },
        headers: {
          Authorization: `Bearer ${db.get("token").value()}`,
          "Content-Type": "application/json"
        }
      });

      if (result.data.status === 200) {
        this.setState({
          alert: {
            status: true,
            message: "کاربر با موفقیت تایید شد"
          }
        });
      } else {
        this.setState({
          alert: {
            status: true,
            message: "خطایی پیش آمده است"
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

  handleAlertBtn = () => {
    this.setState({
      alert: {
        status: false,
        message: ""
      }
    });
  };

  getCity = (selectedCity) => {
    this.setState({
      selectedCity
    })

  }

  render() {
    return (
      <Container>

        <Row>
          <Col>

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

            <Search
              fiedls={this.state.fiedls}
              checkboxes={this.state.checkboxes}
              onSelectLanguage={this.handleSearch}
            />

            <Row>
              <Col md='4'>
                <City onSelectCity={this.getCity}></City>
              </Col>
            </Row>


            <div className="table-responsive">
              <Table className="mt-5">
                <thead>
                  <tr>
                    <th className="text-right">نام و نام خانوادگی</th>
                    <th className="text-right">شماره همراه</th>
                    <th className="text-right">نام شهر</th>
                    <th className="text-right">نوع کاربری</th>
                    <th className="text-right">وضعیت کاربری</th>
                    <th className="text-right">تایید/بن</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.agents.length > 0 ? (
                    this.state.agents.map(agent => {
                      return (
                        <tr key={agent.id}>
                          {/* <th scope="row">###</th> */}
                          <td className="text-right">{agent.fullName}</td>
                          <td className="text-right">{agent.phoneNumber}</td>
                          <td className="text-right">{agent.cityName.state} - {agent.cityName.name} </td>
                          <td className="text-right">{agent.role}</td>
                          <td className="text-right">
                            <Badge color="primary">
                              {agent.isActive === 1 ? "فعال" : "غیر فعال"}
                            </Badge>
                          </td>
                          {agent.isActive === 1 ? (
                            <td className="text-right">
                              <Button
                                value={agent.phoneNumber}
                                color="succes"
                                onClick={this.handleBanBtn}
                              >
                                بن کردن
                              </Button>
                            </td>
                          ) : (
                              <td className="text-right">
                                <Button
                                  value={agent.phoneNumber}
                                  color="danger"
                                  onClick={this.handleAcceptBtn}
                                >
                                  فعال کردن
                              </Button>
                              </td>
                            )}
                        </tr>
                      );
                    })
                  ) : (
                      <tr>
                        <td>
                          <p className="text-right">نماینده ای وجود ندارد</p>
                        </td>
                      </tr>
                    )}
                </tbody>

                {/* </InfiniteScroll> */}
              </Table>
            </div>

            <div className="m-auto d-block mt-3">
              <button
                id="nextBtn"
                className={
                  this.state.page + 1 >= 1 && this.state.agents.length > 0
                    ? "m-2 btn btn-primary"
                    : "d-none"
                }
                onClick={this.handleNextBtn}
              >
                صفحه بعد
              </button>
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
      </Container>
    );
  }
}

export default AgentList;
