import React, { Component } from "react";
import axios from "axios";
import config from "../../config";
import db from "../../helpers/localDB";
import {
  Button,
  Container,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Table,
  Badge
} from "reactstrap";
import TwoFiledSearch from "../twoFiledSearch";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class DiscountList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: {
        status: false,
        message: ""
      },
      page: 1,
      discounts: []
    };

    this.loadDiscounts(this.state.page);
  }
  async loadDiscounts(page = 1) {
    try {
      let result = await axios({
        url: config.app.BASE_URL + "discount/index/?page=" + page,
        method: "get",
        headers: {
          Authorization: `Bearer ${db.get("token").value()}`,
          "Content-Type": "application/json"
        }
      });

      if (result.data.status === 200) {
        if (result.data.discounts.length === 0) {
          this.setState({
            discounts: []
          });
        } else {
          this.setState({
            discounts: result.data.discounts
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

    if (currentPage >= 1 && this.state.discounts.length > 0) {
      this.setState({
        page: currentPage
      });

      this.loadDiscounts(currentPage);
    }
  };

  handlePrevBtn = e => {
    e.preventDefault();
    let currentPage = this.state.page - 1;

    if (currentPage >= 1) {
      this.setState({
        page: currentPage
      });

      this.loadDiscounts(currentPage);
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

  handleDeleteBtn = async e => {
    e.preventDefault();
    try {
  

      let result = await axios({
        url: config.app.BASE_URL + "discount/delete",
        method: "delete",
        data: {
          discountId: e.target.value
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
            message: "کد تخفیف با موفقیت حذف شد"
          }
        });
        this.loadDiscounts();
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

            <Row>
              <Col className="col-md-2 m-3">
                <Link
                  to={{ pathname: "add" }}
                  className="topMargin2 btn btn-danger"
                >
                  {" "}
                  ساخت کد تخفیف{" "}
                </Link>
              </Col>
            </Row>
            <div className="table-responsive">
              <Table className="mt-5">
                <thead>
                  <tr>
                    <th className="text-right">کد تخفیف</th>
                    <th className="text-right">نوع تخفیف</th>
                    <th className="text-right">مقدار تخفیف</th>
                    <th className="text-right">زمان انقضا</th>
                    <th className="text-right">تعداد مصرف</th>
                    <th className="text-right">تعداد مصرفی کلی</th>
                    <th className="text-right">سفر اول</th>
                    <th className="text-right">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.discounts.length > 0 ? (
                    this.state.discounts.map(discount => {
                      return (
                        <tr key={discount.id}>
                          {/* <th scope="row">###</th> */}
                          <td className="text-right">
                            {" "}
                            <Badge color="primary">{discount.code}</Badge>
                          </td>
                          <td className="text-right">
                            {discount.value.type === 2 ? "غیر درصدی" : "درصدی"}
                          </td>
                          <td className="text-right">
                            {discount.value.amount}
                          </td>
                          <td className="text-right">{discount.endTime}</td>
                          <td className="text-right">{discount.usageCount}</td>
                          <td className="text-right">{discount.totalUsageCount}</td>
                          <td className="text-right">
                            {discount.tripOption.tripOnlyTheFirst
                              ? "فقط سفر اول"
                              : "تمام سفر ها"}
                          </td>
                          <td className="text-right">
                            <Button
                              value={discount.id}
                              color="danger"
                              onClick={this.handleDeleteBtn}
                            >
                              حذف
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td>
                        <p className="text-right">کد تخفیفی وجود ندارد</p>
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
                  this.state.page + 1 >= 1 && this.state.discounts.length > 0
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
      </Container>
    );
  }
}

export default DiscountList;
