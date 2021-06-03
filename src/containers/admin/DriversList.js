import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import config from "../../config";
import db from "../../helpers/localDB";
import { Table, Button, Badge, Container, Row, Col } from "reactstrap";
//import SearchWithFilter from './searchWithFilter';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Search from "../mainSearch";
import City from '../city';
import ExportExcel from '../../components/ExportExcel/ExportExcel'

class DriverList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      drivers: [],
      page: 1,
      searchData: [],
      statusList: [],
      showLoader: false,
      isActive: 1,
      fiedls: [{ name: 'شماره موبایل' }, { name: 'نام' }],
      checkboxes: [
        { label: 'عادی', checked: false, value: 0 },
        { label: 'در حین درخواست', checked: false, value: 1 },
        { label: 'در حال رفتن به مبدا', checked: false, value: 2 },
        { label: 'در حال رفتن به مقصد', checked: false, value: 3 },
        { label: 'در حال امتیازدهی', checked: false, value: 4 }
      ],
      selectedCity: '',
      driverListExcel: [],
      loading: false
    }

    this.loadDrivers()
  }

  async loadDrivers(page = 1, search = [], statusList) {
    this.state.showLoader = true

    try {
      let result = await axios({
        url: config.app.BASE_URL + 'panel/index/drivers',
        method: 'post',
        headers: {
          Authorization: `Bearer ${db.get('token').value()}`,
          'Content-Type': 'application/json'
        },
        data: {
          filter: {
            status: statusList,
            isActive: this.state.isActive,
            cityId: this.state.selectedCity
          },

          search: { phoneNumber: search[0], name: search[1] }
        },
        params: {
          page: page
        }
      })

      this.state.showLoader = false
      if (result.data.status === 200) {
        if (result.data.drivers.length === 0) {
          this.setState({
            drivers: []
          })
        } else {
          this.setState({
            drivers: result.data.drivers
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

    if (currentPage >= 1 && this.state.drivers.length > 0) {
      this.setState({
        page: currentPage
      })

      // this.loadDrivers(currentPage);
      this.loadDrivers(
        currentPage,
        this.state.searchData,
        this.state.statusList
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

      // this.loadDrivers(currentPage);
      this.loadDrivers(
        currentPage,
        this.state.searchData,
        this.state.statusList
      )
    }
  }

  handleSearch = (searchData, statusList) => {
    //console.log(searchData);
    this.setState({
      searchData: searchData,
      statusList: statusList,
      page: 1
    })
    this.loadDrivers(1, searchData, statusList)
  }
  handletoggle = (e) => {
    if (e.target.checked) {
      this.setState({
        isActive: 1
      })
    } else {
      this.setState({
        isActive: 0
      })
    }
    console.log('toggle:' + this.state.isActive)
  }
  getCity = (selectedCity) => {
    this.setState({
      selectedCity
    })
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
            url: config.app.BASE_URL + 'panel/index/drivers',
            method: 'post',
            headers: {
              Authorization: `Bearer ${db.get('token').value()}`,
              'Content-Type': 'application/json'
            },
            data: {
              filter: {
                status: this.state.statusList,
                isActive: this.state.isActive,
                cityId: this.state.selectedCity
              },

              search: {
                phoneNumber: this.state.searchData[0],
                name: this.state.searchData[1]
              },
              startDate: this.state.startDate,
              endDate: this.state.endDate
            },
            params: {
              page: startPage + i
            }
          })

          if (result.data.status === 200) {
            result.data.drivers.map((driver) => {
              driver_ListExcel.push({
                name: `${driver.name} ${driver.familyName}`,
                phoneNumber: driver.phoneNumber,
                carName: driver.carName,
                city: driver.city,
                isActive: driver.isActive,
                lastTripStatus: driver.lastTripStatus,
                isOnline: driver.isOnline,
                wallet: driver.wallet,
                tripsDistance: driver.tripsDistance
              })
            })
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
        <Search
          fiedls={this.state.fiedls}
          checkboxes={this.state.checkboxes}
          onSelectLanguage={this.handleSearch}
        />
        <Row>
          <Col md="4">
            <City onSelectCity={this.getCity}></City>
          </Col>
        </Row>
        {/* <SearchWithFilter onSelectLanguage={this.handleSearch}></SearchWithFilter> */}
        <Row>
          <Col md="2">
            <ul className="tg-list ltr">
              <li className="tg-list-item">
                <label className="f-right mt-1 mr-2">فعال</label>
                {/* <input
                  className="tgl tgl-ios"
                  defaultChecked={this.state.isActive}
                  type="checkbox"
                />
                <label className="tgl-btn" htmlFor="cb2" /> */}

                <label className="switch">
                  <input
                    defaultChecked={this.state.isActive}
                    type="checkbox"
                    onChange={this.handletoggle}
                  />
                  <span className="slider round" />
                </label>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className="centerize height1">
          {this.state.showLoader ? (
            <FontAwesomeIcon icon="spinner" className="Loader" />
          ) : (
            ''
          )}
        </Row>

        <Row>
          <Col>
            <div className="table-responsive">
              <Table className="mt-5">
                {/* <InfiniteScroll
                pageStart={0}
                loadMore={this.loadDrivers.bind(this)}
                hasMore={loadMore}
                loader={<div className="loader" key={0}>در حال دریافت اطلاعات...</div>}
              > */}
                <thead>
                  <tr>
                    <th className="text-right">نام و نام خانوادگی</th>
                    <th className="text-right">شماره همراه</th>
                    <th className="text-right">خودرو</th>
                    <th className="text-right">نام شهر</th>
                    <th className="text-right">وضعیت کاربری</th>
                    <th className="text-right">وضعیت سفر</th>
                    <th className="text-right">وضعیت فعالیت</th>
                    <th className="text-right">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.drivers.length > 0 ? (
                    this.state.drivers.map((driver) => {
                      return (
                        <tr key={driver.id}>
                          {/* <th scope="row">###</th> */}
                          <td className="text-right">
                            {driver.name + ' ' + driver.familyName}
                          </td>
                          <td className="text-right">{driver.phoneNumber}</td>
                          <td className="text-right">{driver.carName}</td>
                          <td className="text-right">{driver.city}</td>
                          <td className="text-right">
                            <Badge color="dark">{driver.isActive}</Badge>
                          </td>

                          <td className="text-right">
                            <Badge color="primary">
                              {driver.lastTripStatus}
                            </Badge>
                          </td>
                          {driver.isOnline ? (
                            <td className="text-right">
                              <Badge color="succes">آنلاین</Badge>
                            </td>
                          ) : (
                            <td className="text-right">
                              <Badge color="danger">آفلاین</Badge>
                            </td>
                          )}

                          <td className="text-right">
                            <Link to={'driver/' + driver.id}>
                              <Button color="info" size="sm">
                                نمایش اطلاعات
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td>
                        <p className="text-right">راننده ای وجود ندارد</p>
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
                  this.state.page + 1 >= 1 && this.state.drivers.length > 0
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
              'نام و نام خانوادگی',
              'شماره همراه',
              'خودرو',
              'نام شهر',
              'وضعیت کاربری',
              'وضعیت سفر',
              'وضعیت فعالیت',
              'موجودی کیف پول',
              'پیمایش سفر ها'
            ]}
            onClick={this.getExportExcel}
            loading={this.state.loading}
          />
        </Row>
      </Container>
    )
  }
}

export default DriverList;
