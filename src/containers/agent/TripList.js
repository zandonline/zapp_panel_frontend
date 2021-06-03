import React, { Component } from 'react'
import axios from 'axios'
import config from '../../config'
import db from '../../helpers/localDB'
import {
  Button,
  Container,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import TwoFiledSearch from '../twoFiledSearch'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DateTimePicker } from 'react-advance-jalaali-datepicker'
import ExportExcel from '../../components/ExportExcel/ExportExcel'

class TripList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trips: [],
      page: 1,
      alert: {
        status: false,
        message: ''
      },
      searchDataforDriver: '',
      searchDataforPassenger: '',
      statusList: [],
      checkedType: [],
      paymentType: '',
      showLoader: false,
      fiedls: [{ name: 'شماره مسافر' }, { name: 'شماره راننده' }],
      checkboxes: [
        { label: 'موقت', checked: false, value: 0 },
        { label: 'در حال رفتن به مبدا', checked: false, value: 1 },
        { label: 'رزرو', checked: false, value: 2 },
        { label: 'رزرو تایید شده', checked: false, value: 2000 },
        { label: 'در حال رفتن به مقصد', checked: false, value: 100 },
        { label: 'تمام شده', checked: false, value: 200 },
        { label: 'اقتصادی', checked: false, value: -1 },
        { label: 'اقتصادی', checked: false, value: -1 },
        { label: 'بانوان', checked: false, value: 4 }
      ],
      driverListExcel: [],
      loading: false
    }

    this.loadTrips()
  }

  async loadTrips(
    page = 1,
    searchDataforPassenger,
    searchDataforDriver,
    statusList,
    checkedType,
    paymentType
  ) {
    this.state.showLoader = true
    try {
      let result = await axios({
        url: config.app.BASE_URL + 'panel/index/trips/?page=' + page,
        method: 'post',
        headers: {
          Authorization: `Bearer ${db.get('token').value()}`,
          'Content-Type': 'application/json'
        },
        data: {
          filter: {
            status: statusList,
            type: checkedType,
            paymentMethod: paymentType,
            cityId: this.state.selectedCity
          },

          search: {
            passengerPhoneNumber: searchDataforPassenger,
            driverPhoneNumber: searchDataforDriver
          }
        }
      })
      this.state.showLoader = false
      if (result.data.status === 200) {
        if (result.data.trips.length === 0) {
          this.setState({
            trips: []
          })
        } else {
          this.setState({
            trips: result.data.trips
          })
        }
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  handleNextBtn = (e) => {
    e.preventDefault()

    let currentPage = this.state.page + 1

    if (currentPage >= 1 && this.state.trips.length > 0) {
      this.setState({
        page: currentPage
      })

      this.loadTrips(
        currentPage,
        this.state.searchDataforPassenger,
        this.state.searchDataforDriver,
        this.state.statusList,
        this.state.checkedType,
        this.state.paymentType
      )
    }
  }

  handlePrevBtn = (e) => {
    e.preventDefault()
    let currentPage = this.state.page - 1

    if (currentPage >= 1) {
      this.setState({
        page: currentPage
      })

      this.loadTrips(
        currentPage,
        this.state.searchDataforPassenger,
        this.state.searchDataforDriver,
        this.state.statusList,
        this.state.checkedType,
        this.state.paymentType
      )
    }
  }

  handleAlertBtn = () => {
    this.setState({
      alert: {
        status: false,
        message: ''
      }
    })
  }
  handleSearch = (
    searchDataforPassenger,
    searchDataforDriver,
    statusList,
    checkedType,
    paymentType
  ) => {
    //console.log(searchData);
    this.setState({
      searchDataforPassenger: searchDataforPassenger,
      searchDataforDriver: searchDataforDriver,
      statusList: statusList,
      checkedType: checkedType,
      paymentType: paymentType,
      page: 1
    })
    this.loadTrips(
      1,
      searchDataforPassenger,
      searchDataforDriver,
      statusList,
      checkedType,
      paymentType
    )
  }

  ejectTrip = async (e) => {
    try {
      let result = await axios({
        url: config.app.BASE_URL + 'panel/trip/eject',
        method: 'post',
        headers: {
          Authorization: `Bearer ${db.get('token').value()}`,
          'Content-Type': 'application/json'
        },
        data: {
          tripId: e.id
        }
      })

      if (result.data.status === 200) {
        this.loadTrips()
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  getExportExcel = async () => {
    const startPage = +document.querySelector('#startPage').value
    const endPage = +document.querySelector('#endPage').value
    const driver_ListExcel = []
    const stepReqect = endPage - startPage + 1

    if (!startPage || !endPage || startPage > endPage) {
      let spanErrMsg = document.querySelector('#errMsgExcel')
      spanErrMsg.innerHTML = 'لطفاً شماره صفحات را به طور صحیح وارد کنید .'
      setTimeout(() => {
        spanErrMsg.innerHTML = ''
      }, 2000)
    } else {
      this.setState({ loading: true })
      for (let i = 0; i < stepReqect; i++) {
       
        try {
          let result = await axios({
            url:
              config.app.BASE_URL + 'panel/index/trips/?page=' + startPage + i,
            method: 'post',
            headers: {
              Authorization: `Bearer ${db.get('token').value()}`,
              'Content-Type': 'application/json'
            },
            data: {
              filter: {
                status: this.state.statusList,
                type: this.state.checkedType,
                paymentMethod: this.state.paymentType,
                cityId: this.state.selectedCity
              },

              search: {
                passengerPhoneNumber: this.state.searchDataforPassenger,
                driverPhoneNumber: this.state.searchDataforDriver
              }
            }
          })

          if (result.data.status === 200) {
            if (result.data.trips.length !== 0) {
              result.data.trips.map((trip) => {
                driver_ListExcel.push({
                  tripCode: trip.tripCode,
                  date: trip.date,
                  driver_fullName: trip.driver.fullName,
                  passengers_name: trip.passengers[0].name,
                  passengers_phoneNumber: trip.passengers[0].phoneNumber,
                  start_address_name: trip.start[0].address.name,
                  end_address_name: trip.end[0].address.name,
                  tripCostType: trip.tripCostType,
                  paymentStatus: trip.paymentStatus,
                  tripCost_passenger: trip.tripCost.passenger,
                  tripDiscountCost: trip.tripDiscountCost,
                  status: trip.status,
                  tripScore: trip.tripScore
                })
              })
            }
          }
        } catch (e) {
          console.log(e.message)
        }
      }
      this.setState({ loading: false })
      this.setState({ driverListExcel: driver_ListExcel })
      document.querySelector('#exportExcelBox button').click()
    }
  }

  render() {
    return (
      <Container>
        <TwoFiledSearch
          onSelectLanguage={this.handleSearch}
          labelone="شماره مسافر"
          labeltwo="شماره راننده"
        ></TwoFiledSearch>

        <Row className="centerize height1">
          {this.state.showLoader ? (
            <FontAwesomeIcon icon="spinner" className="Loader" />
          ) : (
            ''
          )}
        </Row>
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
                </Button>{' '}
              </ModalFooter>
            </Modal>

            <div className="table-responsive">
              <table className="table mt-5">
                <thead>
                  <tr>
                    <th scope="col" className="text-right">
                      کد سفر
                    </th>
                    <th scope="col" className="text-right">
                      تاریخ درخواست
                    </th>
                    <th scope="col" className="text-right">
                      راننده
                    </th>
                    <th scope="col" className="text-right">
                      مسافر
                    </th>
                    <th scope="col" className="text-right">
                      شماره مسافر
                    </th>
                    <th scope="col" className="text-right">
                      مبدا
                    </th>
                    <th scope="col" className="text-right">
                      مقصد
                    </th>
                    <th scope="col" className="text-right">
                      نوع پرداخت
                    </th>
                    <th scope="col" className="text-right">
                      وضعیت پرداخت
                    </th>
                    <th scope="col" className="text-right">
                      هزینه سفر
                    </th>
                    <th scope="col" className="text-right">
                      هزینه سفر بعد تخفیف
                    </th>
                    <th scope="col" className="text-right">
                      وضعیت سفر
                    </th>
                    <th scope="col" className="text-right">
                      امتیاز سفر
                    </th>
                    <th scope="col" className="text-right">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.trips.length > 0 ? (
                    this.state.trips.map((trip, index) => {
                      return (
                        <tr key={index}>
                          <td className="text-right">{trip.tripCode}</td>
                          <td className="text-right">{trip.date}</td>
                          <td className="text-right">
                            <Link to={'/agent/driver/' + trip.driver.id}>
                              {trip.driver.fullName}
                            </Link>
                          </td>
                          <td className="text-right">
                            {trip.passengers[0]
                              ? trip.passengers[0].name
                              : 'بدون نام'}
                          </td>
                          <td className="text-right">
                            {trip.passengers[0]
                              ? trip.passengers[0].phoneNumber
                              : '0'}
                          </td>
                          <td className="text-right">
                            {trip.start[0].address.name}
                          </td>
                          <td className="text-right">
                            {trip.end[0].address.name}
                          </td>
                          <td className="text-right">{trip.tripCostType}</td>
                          <td className="text-right">
                            <span className="badge badge-dark">
                              {trip.paymentStatus}
                            </span>
                          </td>
                          <td className="text-right">
                            {trip.tripCost.passenger}
                          </td>
                          <td className="text-right">
                            {trip.tripDiscountCost}
                          </td>
                          <td className="text-right">
                            <span className="badge badge-primary">
                              {trip.status}
                            </span>
                          </td>
                          <td className="text-right">{trip.tripScore}</td>
                          <td>
                            <Button
                              color="warning"
                              size="sm"
                              onClick={() => {
                                this.ejectTrip(trip)
                              }}
                            >
                              لغو سفر
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td>
                        <p className="text-right">درخواستی وجود ندارد</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="m-auto d-block mt-3">
              <button
                id="nextBtn"
                className={
                  this.state.page + 1 >= 1 && this.state.trips.length > 0
                    ? 'm-2 btn btn-primary'
                    : 'd-none'
                }
                onClick={this.handleNextBtn}
              >
                صفحه بعد
              </button>
              <span className="Mypagination">{this.state.page}</span>
              <button
                id="prevBtn"
                className={
                  this.state.page - 1 >= 1 ? 'm-2 btn btn-primary' : 'd-none'
                }
                onClick={this.handlePrevBtn}
              >
                صفحه قبل
              </button>
            </div>
          </Col>
        </Row>
        <Row>
          <ExportExcel
            dataSet={this.state.driverListExcel}
            sheetName="لیست رانندگان"
            colName={[
              'کد سفر',
              'تاریخ درخواست',
              'راننده',
              'مسافر',
              'شماره مسافر',
              'مبدا',
              'مقصد',
              'نوع پرداخت',
              'وضعیت پرداخت',
              'هزینه سفر',
              'هزینه سفر بعد تخفیف',
              'وضعیت سفر',
              'امتیاز سفر'
            ]}
            onClick={this.getExportExcel}
            loading={this.state.loading}
          />
        </Row>
      </Container>
    )
  }
}

export default TripList
