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
  FormGroup,
  Input
} from "reactstrap";
import { DatePicker } from "react-advance-jalaali-datepicker";
import TwoFiledSearch from "../twoFiledSearch";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AddDiscount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      endTime: 0,
      amount: 1000,
      amountType: 2,
      usageCount: 1,
      totalUsageCount:1,
      tripOnlyTheFirst: 0,
      alert: {
        status: false,
        message: ""
      }
    };
  }

  handleCode = e => {
    e.preventDefault();

    this.setState({
      code: e.target.value
    });
  };

  handleEndTime = e => {
   
    this.setState({
      endTime: e*1000
    });
  };

  handleAmount = e => {
    e.preventDefault();

    this.setState({
      amount: e.target.value
    });
  };

  handleAmount = e => {
    e.preventDefault();

    this.setState({
      amount: e.target.value
    });
  };

  handleAmountType = e => {
    this.setState({
      amountType: e.target.value
    });
  };

  handleUsageCount = e => {
    e.preventDefault();

    this.setState({
      usageCount: e.target.value
    });
  };

  handleTotalUsageCount = e => {
    e.preventDefault();

    this.setState({
      totalUsageCount: e.target.value
    });
  };

  handleTripOnlyTheFirst = e => {

    this.setState({
      tripOnlyTheFirst: parseInt(e.target.value)
    });
  };

  handleAlertBtn = () => {
    this.setState({
      alert: {
        status: false,
        message: ""
      }
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    try {
      const Formdata = {
        code: this.state.code,
        endTime: this.state.endTime,
        amount: this.state.amount,
        amountType: this.state.amountType,
        usageCount: this.state.usageCount,
        totalUsageCount:this.state.totalUsageCount,
        tripOnlyTheFirst: this.state.tripOnlyTheFirst
      };
      if (this.state.endTime == 0) {
        this.setState({
          alert: {
            status: true,
            message: "تاریخ انقضا را وارد کنید"
          }
        });
        return;
      }

    
      let result = await axios({
        method: "post",
        url: config.app.BASE_URL + "discount/create",
        headers: { Authorization: `Bearer ${db.get("token").value()}`,"Content-Type": "application/json" },
        data: Formdata
       
      });


      if (result.data.status === 200) {
        this.props.history.push("/agent/discounts/index");

      } else {
        this.setState({
          alert: {
            status: true,
            message: result.data.message
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
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 mt-4">
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

            <h1 className="text-right">ساخت کد تخفیف</h1>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="code" className="d-block text-right">
                  کد تخفیف
                </label>
                <input
                  required
                  type="text"
                  className="form-control"
                  id="code"
                  onChange={this.handleCode}
                  placeholder="کد تخفیف"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime" className="d-block text-right">
                  تاریخ انقضا
                </label>
                <DatePicker
                  placeholder="تاریخ انقضا "
                  format="jYYYY/jMM/jDD"
                  id="endTime"
                  onChange={this.handleEndTime}
                />
              </div>

              <div className="form-group">
                <label className="d-block text-right">نوع تخفیف</label>
                <label htmlFor="discountType" className="d-block text-right">
                  درصدی
                  <input
                    type="radio"
                    name="discountType"
                    value={1}
                    checked={this.state.amountType == 1}
                    onChange={this.handleAmountType}
                  />
                </label>

                <label htmlFor="discountType" className="d-block text-right">
                  غیر درصدی
                  <input
                    type="radio"
                    name="discountType"
                    value={2}
                    checked={this.state.amountType == 2}
                    onChange={this.handleAmountType}
                  />
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="discountAmount" className="d-block text-right">
                  مقدار تخفیف
                </label>
                <input
                  required
                  type="text"
                  className="form-control"
                  id="discountAmount"
                  onChange={this.handleAmount}
                  placeholder="مقدار تخفیف"
                />
              </div>

              <div className="form-group">
                <label htmlFor="usageCount" className="d-block text-right">
                  تعداد مصرف کلی
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="totalUsageCount"
                  onChange={this.handleTotalUsageCount}
                  placeholder="تعداد مجاز همه کاربران برای استفاده از کد تخفیف"
                />
              </div>

              <div className="form-group">
                <label htmlFor="usageCount" className="d-block text-right">
                  تعداد مصرف هر کاربر
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="usageCount"
                  onChange={this.handleUsageCount}
                  placeholder="تعداد مجاز برای استفاده از کد تخفیف"
                />
              </div>

              <div className="form-group">
                <label
                  className="d-block text-right"
                >
                  سفر اول
                </label>

                <label
                  htmlFor="tripOnlyTheFirst"
                  className="d-block text-right"
                >
                  فقط برای سفر اول
                  <input
                    type="radio"
                    name="tripOnlyTheFirst"
                    value={1}
                    checked={this.state.tripOnlyTheFirst === 1}
                    onChange={this.handleTripOnlyTheFirst}
                  />
                </label>

                <label
                  htmlFor="tripOnlyTheFirst"
                  className="d-block text-right"
                >
                  تمام سفر ها
                  <input
                    type="radio"
                    name="tripOnlyTheFirst"
                    value={0}
                    checked={this.state.tripOnlyTheFirst === 0}
                    onChange={this.handleTripOnlyTheFirst}
                  />
                </label>
              </div>

              <button type="submit" className="btn btn-primary float-right">
                ایجاد کد
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AddDiscount;
