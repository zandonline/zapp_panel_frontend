import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import db from '../helpers/localDB'
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import ExportExcel from '../components/ExportExcel/ExportExcel'
// import moment from "moment-jalaali";

import TwoFieldSearch2 from './twoFiledSearch2'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import InputMask from 'react-input-mask';
import { DateTimePicker } from 'react-advance-jalaali-datepicker'
// import City from './city';
class TripReservedList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trips: [],
      tripId: null,
      tripCost: null,
      tripStatus: null,
      page: 1,
      alert: {
        status: false,
        message: ''
      },
      startDate: '',
      startTime: '',
      endDate: '',
      // endTime:'',
      // Date1:'',
      // Date2:'',
      selectedCity: '',
      statusList: '',
      excelList: [],
      loading: false
    }

    this.newRequestStyle = {
      background: '#e4bae4',
      fontWeight: 'bolder'
    }

    this.loadTrips()
  }

  async loadTrips(
    page = 1,
    searchDataforPassenger,
    searchDataforDriver,
    statusList
  ) {
    // this.state.Date1=this.state.startDate+ ' ' + this.state.startTime;
    // this.state.Date2=this.state.endDate+ ' ' + this.state.endTime;
    // var miladi=moment(this.state.Date1, 'jYYYY-jM-jD HH:mm').format('YYYY-M-D HH:mm:ss');
    // var miladi2=moment(this.state.Date2, 'jYYYY-jM-jD HH:mm').format('YYYY-M-D HH:mm:ss');
    this.state.showLoader = true
    try {
      let result = await axios({
        url: config.app.BASE_URL + 'panel/index/trips/reserved?page=' + page,
        method: 'post',
        headers: {
          Authorization: `Bearer ${db.get('token').value()}`,
          'Content-Type': 'application/json'
        },
        data: {
          filter: {
            carType: statusList,
            startDate: this.state.startDate,
            endDate: this.state.endDate
            // "cityId":this.state.selectedCity
            // moment(miladi2).unix()
          },

          search: {
            passengerName: searchDataforPassenger,
            passengerPhoneNumber: searchDataforDriver
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

  // shouldComponentUpdate(nextProps, nextState) {

  // }

  handleNextBtn = (e) => {
    e.preventDefault()

    let currentPage = this.state.page + 1

    if (currentPage >= 1 && this.state.trips.length > 0) {
      this.setState({
        page: currentPage
      })

      this.loadTrips(currentPage)
    }
  }

  handlePrevBtn = (e) => {
    e.preventDefault()
    let currentPage = this.state.page - 1

    if (currentPage >= 1) {
      this.setState({
        page: currentPage
      })

      this.loadTrips(currentPage)
    }
  }

  handleTripCostInput = (e) => {
    this.setState({
      tripCost: e.target.value
    })
  }

  handleTripStatusInput = (e) => {
    this.setState({
      tripStatus: e.target.value
    })
  }

  handleOperationBtn = (e) => {
    if (!this.state.operationBtn) {
      let valueObj = JSON.stringify(e.target.value)
      let value = valueObj.substring(1, valueObj.length - 1).split(',')

      let tripId = value[0]
      let tripStatus = value[1]
      let tripCost = value[2]
      this.setState(
        {
          tripId,
          tripStatus,
          tripCost
        },
        () => {
          this.setState({
            operationBtn: true
          })
        }
      )
    } else {
      this.setState({
        operationBtn: false
      })
    }
  }

  handleEditTripBtn = async (e) => {
    try {
      let result = await axios({
        url: config.app.BASE_URL + 'panel/edit/trips/reserved',
        method: 'post',
        data: {
          id: this.state.tripId,
          status: this.state.tripStatus,
          cost: this.state.tripCost
        },

        headers: {
          Authorization: `Bearer ${db.get('token').value()}`,
          'Content-Type': 'application/json'
        }
      })

      if (result.data.status === 200) {
        this.loadTrips()
      }

      this.setState({
        alert: {
          status: true,
          message: result.data.message
        }
      })
    } catch (e) {
      this.setState({
        alert: {
          status: false,
          message: e.message
        }
      })
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

  handleSearch = (searchDataforPassenger, searchDataforDriver, statusList) => {
    //console.log(searchData);
    this.setState({
      searchDataforPassenger: searchDataforPassenger,
      searchDataforDriver: searchDataforDriver,
      statusList: statusList,
      page: 1
    })
    if (statusList === '') {
      statusList = 0
    }
    this.loadTrips(1, searchDataforPassenger, searchDataforDriver, statusList)
  }
  // handleDate =(e)=>{
  //   this.setState({
  //     startDate:e.target.value
  //   })

  // }
  // handleDateEnd= (e)=>{
  //   this.setState({
  //   endDate:e.target.value
  // })

  // }
  // handleTime =(e)=>{
  //   this.setState({
  //     startTime:e.target.value
  //   })

  // }
  // handleTimeEnd=(e)=>{
  //     this.setState({
  //     endTime:e.target.value
  //   })
  // }
  changestartDate = (e) => {
    this.setState({
      startDate: e
    })
    // console.log(moment.unix(e).format("MM/DD/YYYY"))
  }
  changeEndDate = (e) => {
    this.setState({
      endDate: e
    })
    // console.log(moment.unix(e).format("MM/DD/YYYY"))
  }
  getCity = (selectedCity) => {
    this.setState({
      selectedCity
    })
  }

  getExportExcel = async () => {
    const startPage = +document.querySelector('#startPage').value
    const endPage = +document.querySelector('#endPage').value
    const excel_List = []
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
              config.app.BASE_URL +
              'panel/index/trips/reserved?page=' +
             ( startPage +i),
            method: 'post',
            headers: {
              Authorization: `Bearer ${db.get('token').value()}`,
              'Content-Type': 'application/json'
            },
            data: {
              filter: {
                carType: this.state.statusList,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                cityId: this.state.selectedCity
              },

               search: {
                passengerName: this.state.searchDataforPassenger,
                passengerPhoneNumber: this.state.searchDataforDriver
              }
            }
          })

          if (result.data.status === 200) {
            if (result.data.trips.length !== 0) {
              result.data.trips.map((trip) => {
                excel_List.push({
                  city: trip.city,
                  date: trip.date,
                  carType: trip.carType,
                  startAddress: trip.startAddress,
                  endAddress: trip.endAddress,
                  passengerName: trip.passengerName,
                  passengerPhoneNumber: trip.passengerPhoneNumber
                })
              })
            }
          }
        } catch (e) {
          console.log(e.message)
        }
      }
      this.setState({ loading: false })
      this.setState({ excelList: excel_List })
      document.querySelector('#exportExcelBox button').click()
    }
  }
  render() {
    return (
      <Container>
        <TwoFieldSearch2
          onSelectLanguage={this.handleSearch}
          labelone="نام مسافر"
          labeltwo="شماره مسافر"
        ></TwoFieldSearch2>
        <Row>
          <Col md="4">
            <label>تاریخ شروع</label>
            <DateTimePicker
              placeholder="انتخاب تاریخ و ساعت"
              format="تاریخ: jYYYY/jMM/jDD ساعت: HH:mm"
              id="dateTimePicker"
              onChange={this.changestartDate}
            />
            {/* <InputMask className='form-control' mask="9999/99/99"  onChange={this.handleDate}  /> */}
          </Col>
          {/* <Col md="3">
            <label>ساعت</label>
            <Input  onChange={this.handleTime} type="time"/>
            </Col> */}

          <Col md="4">
            <label>تاریخ پایان</label>
            <DateTimePicker
              placeholder="انتخاب تاریخ و ساعت"
              format="تاریخ: jYYYY/jMM/jDD ساعت: HH:mm"
              id="dateTimePicker2"
              onChange={this.changeEndDate}
            />
            {/* <InputMask className='form-control' mask="9999/99/99" onChange={this.handleDateEnd}   />
             */}
          </Col>
          {/* <Col md="3">
            <label>ساعت</label>
            <Input  onChange={this.handleTimeEnd} type="time"/>
            </Col>
            */}
        </Row>
        {/* <Row>
          <Col md='4'>
            <City onSelectCity={this.getCity}></City>
          </Col>
        </Row>
        <Row className="centerize height1">
          {
            this.state.showLoader ?
              <FontAwesomeIcon icon="spinner" className="Loader" />
              :
              ''
          }
        </Row> */}
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

            <Modal
              isOpen={this.state.operationBtn}
              toggle={this.handleOperationBtn}
            >
              <ModalBody>
                <p className="h6 p-2">وضعیت درخواست</p>
                <Input
                  value={this.state.tripStatus}
                  type="select"
                  id="tripStatus"
                  onChange={this.handleTripStatusInput}
                >
                  <option
                    value={2000}
                    disabled={
                      this.state.tripStatus === 2000 ||
                      this.state.tripStatus === -1000
                    }
                  >
                    انجام شده
                  </option>
                  <option
                    value={-1000}
                    disabled={
                      this.state.tripStatus === 2000 ||
                      this.state.tripStatus === -1000
                    }
                  >
                    کنسل شده
                  </option>
                  <option
                    value={1000}
                    disabled={this.state.tripStatus === 2000 || -1000}
                  >
                    در حال بررسی
                  </option>
                </Input>
                <p className="h6 p-2">هزینه سفر</p>

                <Input
                  type="text"
                  id="tripCost"
                  value={this.state.tripCost}
                  onChange={this.handleTripCostInput}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onClick={this.handleEditTripBtn}
                  size="sm"
                >
                  اعمال تغییرات
                </Button>
              </ModalFooter>
            </Modal>

            <div className="table-responsive">
              <Table className="mt-5">
                <thead>
                  <tr>
                    <th className="text-right">شهر</th>
                    <th className="text-right">تاریخ درخواست</th>
                    <th className="text-right">نوع خودرو</th>
                    <th className="text-right">آدرس مبدا</th>
                    <th className="text-right">آدرس مقصد</th>
                    <th className="text-right">نام مسافر</th>
                    <th className="text-right">شماره همراه مسافر</th>
                    <th className="text-right">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.trips.length > 0 ? (
                    this.state.trips.map((trip) => {
                      return (
                        <tr
                          key={trip.id}
                          onMouseOver={this.handleOnMouseOver}
                          style={!trip.isRead ? this.newRequestStyle : {}}
                        >
                          {/* <th scope="row">###</th> */}
                          <td className="text-right">{trip.city}</td>
                          <td className="text-right">{trip.date}</td>
                          <td className="text-right">{trip.carType}</td>
                          <td className="text-right">{trip.startAddress}</td>
                          <td className="text-right">{trip.endAddress}</td>
                          <td className="text-right">{trip.passengerName}</td>
                          <td className="text-right">
                            {trip.passengerPhoneNumber}
                          </td>
                          <td className="text-right">
                            <button
                              className="btn btn-primary"
                              value={[trip.id, trip.status, trip.cost]}
                              onClick={this.handleOperationBtn}
                            >
                              مشاهده اطلاعات
                            </button>
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

                {/* </InfiniteScroll> */}
              </Table>
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
            dataSet={this.state.excelList}
            sheetName="لیست درخواست های حمل بار"
            colName={[
              'شهر',
              'تاریخ درخواست',
              'نوع خودرو',
              'آدرس مبدا',
              'آدرس مقصد',
              'نام مسافر',
              'شماره همراه مسافر',
              'عملیات'
            ]}
            onClick={this.getExportExcel}
            loading={this.state.loading}
          />
        </Row>
      </Container>
    )
  }
}

export default TripReservedList
