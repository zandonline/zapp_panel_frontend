import React, { useState, useEffect } from 'react'
import L from 'leaflet'
import Locate from 'leaflet.locatecontrol'
import { withRouter } from 'react-router-dom'
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
  Input,
  CardImg,
  CardText,
  CardTitle,
  CustomInput
} from 'reactstrap'
import axios from 'axios'
import Nouislider from 'nouislider-react'
import 'nouislider/distribute/nouislider.css'
import './TripRequest.style.css'

import config from '../../../config'
import db from '../../../helpers/localDB'
import { runInThisContext } from 'vm'

import carTypeIcon from '../../../assets/images/carTypes/typecar0.png'

var points = []
var latPoint = []
var lngPoint = []
let map
let _carType
let _markers = []
let _nearDriversMarkers = []

export default function TripRequest() {
  const [markers, setMarkers] = useState([])
  const [currentPoint, setCurrentPoint] = useState([])
  const [currentAddress, setCurrentAddress] = useState('')
  const [nearDrivers, setNearDrivers] = useState([])
  const [nearDriversMarkers, setNearDriversMarkers] = useState([])
  const [nearDriver, setNearDriver] = useState()
  const [latPoint, setLatPoint] = useState([])
  const [latAddress, setLatAddress] = useState('')
  const [latMarker, setLatMarker] = useState(null)
  const [lngPoint, setLngPoint] = useState([])
  const [lngMarker, setLngMarker] = useState(null)
  const [lngAddress, setLngAddress] = useState('')
  const [lng2Point, setLng2Point] = useState([])
  const [lng2Marker, setLng2Marker] = useState(null)
  const [lng2Address, setLng2Address] = useState('')
  const [tripStopTime, setTripStopTime] = useState(0)
  const [tripCost, setTripCost] = useState(0)
  const [tripIsTwoWay, setTripIsTwoWay] = useState(0)
  const [carType, setCarType] = useState(0)
  const [tripType, setTripType] = useState(0)
  const [isNewPassenger, setIsNewPassenger] = useState(false)
  const [passengerFullName, setPassengerFullName] = useState('')
  const [passengerId, setPassengerId] = useState('')
  const [isDriverSelected, setIsDriverSelected] = useState(false)
  const [alert, setAlert] = useState({
    status: false,
    message: ''
  })

  _carType = carType
  _markers = markers
  _nearDriversMarkers = nearDriversMarkers

  const handleAlertBtn = () => {
    setAlert({ status: false, message: '' })
  }

  useEffect(() => {
    let city = db.get('city').value()
    //find lat lng from city name

    map = L.map('tripRequestMap', {
      center: {
        lat: 29.5926,
        lng: 52.5836
      },

      zoom: 11
    })

    // add the OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map)

    //user location
    const lc = new Locate()
    lc.addTo(map)

    map.on('click', async (e) => {
      //remove last markers
      if (_markers.length > 0) {
        for (let i = 0; i < _markers.length; i++) {
          map.removeLayer(_markers[i])
        }
      }

      //add lat marker
      let markerIcon = L.icon({
        iconUrl: config.app.ICON_IMAGE_URL + 'marker.png',
        iconSize: [48, 48]
      })
      let marker = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: markerIcon
      }).addTo(map)

      _markers.push(marker)

      setCurrentPoint([e.latlng.lat, e.latlng.lng])

      //get Address of that point
      try {
        let addressRes = await axios({
          method: 'get',
          url: `https://api.neshan.org/v2/reverse?lat=${e.latlng.lat}&lng=${e.latlng.lng}`,
          headers: {
            'Api-Key': 'service.chpZZDd4HOajMDJVpKNo0ARVqif3HLDU23T2G66n'
          }
        })

        if (addressRes.data.status === 'OK') {
          setCurrentAddress(addressRes.data.formatted_address)
        } else {
          setCurrentAddress('نا مشخص')
        }
      } catch (e) {}

      //find near driver
      try {
        let nearDriverRes = await axios({
          method: 'post',
          url: config.app.BASE_URL + 'panel/driver/find/near',
          headers: {
            Authorization: `Bearer ${db.get('token').value()}`,
            'Content-Type': 'application/json'
          },
          data: {
            driverType: _carType,
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }
        })

        if (_nearDriversMarkers.length > 0) {
          for (let i = 0; i < _nearDriversMarkers.length; i++) {
            map.removeLayer(_nearDriversMarkers[i])
          }
        }

        if (nearDriverRes.data.status === 200) {
          setNearDrivers(nearDriverRes.data.drivers)

          nearDriverRes.data.drivers.forEach((driver) => {
            let zappCarIcon = L.icon({
              iconUrl: `http://zapptaxi.com:3005/images/typeCarsIcon/typecar${_carType}.png`,
              iconSize: [20, 32]
            })

            let zappCarMarker = L.marker([driver.lat, driver.lng], {
              icon: zappCarIcon
            }).addTo(map)

            zappCarMarker.on('click', (e) => {
              setNearDriver(driver)
              setIsDriverSelected(true)
            })

            _nearDriversMarkers.push(zappCarMarker)
          })
        }
      } catch (e) {}

      //get Address of that point //LONGGGGGGGGGG API
      try {
        let addressRes = await axios({
          method: 'post',
          url: config.app.BASE_URL + 'panel/trip/address/by/point',
          headers: {
            Authorization: `Bearer ${db.get('token').value()}`,
            'Content-Type': 'application/json'
          },
          data: {
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }
        })

        if (addressRes.data.status === 200) {
          this.setState({
            currentAddress: addressRes.data.address
          })
        } else {
          this.setState({
            currentAddress: 'نا مشخص'
          })
        }
      } catch (e) {}
    })
  }, [])

  const onLatAddressClicked = async (e) => {
    if (currentPoint.length == 0) {
      return
    }
    setLatPoint(currentPoint)
    setLatAddress(currentAddress)
    if (latMarker) {
      map.removeLayer(latMarker)
    }
    let latIcon = L.icon({
      iconUrl: config.app.ICON_IMAGE_URL + 'lat.png',
      iconSize: [48, 48]
    })
    let lat_Marker = L.marker(currentPoint, {
      icon: latIcon
    }).addTo(map)

    setLatMarker(lat_Marker)
  }

  const onLngAddressClicked = async (e) => {
    if (currentPoint.length == 0) {
      return
    }
    setLngPoint(currentPoint)
    setLngAddress(currentAddress)

    if (lngMarker) {
      map.removeLayer(lngMarker)
    }

    let latIcon = L.icon({
      iconUrl: config.app.ICON_IMAGE_URL + 'lng.png',
      iconSize: [48, 48]
    })
    let lng_Marker = L.marker(currentPoint, {
      icon: latIcon
    }).addTo(map)

    setLngMarker(lng_Marker)
  }

  const onLng2AddressClicked = async (e) => {
    if (currentPoint.length == 0) {
      return
    }

    setLng2Point(currentPoint)
    setLng2Address(currentAddress)

    if (lng2Marker) {
      map.removeLayer(lng2Marker)
    }

    let latIcon = L.icon({
      iconUrl: config.app.ICON_IMAGE_URL + 'lng2.png',
      iconSize: [48, 48]
    })
    let lng2_Marker = L.marker(currentPoint, {
      icon: latIcon
    }).addTo(map)

    setLng2Marker(lng2_Marker)
  }

  const onStopTimeChanged = (e) => {
    setTripStopTime(e.target.value)
  }

  const handletoggle = (e) => {
    if (e.target.checked) {
      setTripIsTwoWay(1)
    } else {
      setTripIsTwoWay(0)
    }
  }

  const getPrice = async (e) => {
    if (latPoint.length == 0 || lngPoint.length == 0) {
      return
    }
    //get price
    try {
      let priceRes = await axios({
        method: 'post',
        url: config.app.BASE_URL + 'panel/trip/price',
        headers: {
          Authorization: `Bearer ${db.get('token').value()}`,
          'Content-Type': 'application/json'
        },
        data: {
          start: { coordinates: latPoint },
          ends: [{ coordinates: lngPoint }],
          options: {
            isTwoWay: tripIsTwoWay,
            stopTime: tripStopTime
          },
          tripType: tripType,
          carType: carType
        }
      })

      if (priceRes.data.status == 200) {
        setTripCost(priceRes.data.price)
      }
    } catch (e) {}
  }

  const onCarTypeChanged = async (e) => {
    let tripType = 0

    if (e.target.value == 0) {
      tripType = 0 //taxi
    } else if (e.target.value == 1) {
      tripType = 1 //female
    } else {
      tripType = 2 //reserve
    }

    setCarType(e.target.value)
    setTripType(tripType)

    try {
      if (currentPoint.length) {
        let nearDriverRes = await axios({
          method: 'post',
          url: config.app.BASE_URL + 'panel/driver/find/near',
          headers: {
            Authorization: `Bearer ${db.get('token').value()}`,
            'Content-Type': 'application/json'
          },
          data: {
            driverType: _carType,
            lat: currentPoint[0],
            lng: currentPoint[1]
          }
        })

        if (_nearDriversMarkers.length > 0) {
          for (let i = 0; i < _nearDriversMarkers.length; i++) {
            map.removeLayer(_nearDriversMarkers[i])
          }
        }
        console.log('nearDriverRes : ', nearDriverRes)
        if (nearDriverRes.data.status === 200) {
          setNearDrivers(nearDriverRes.data.drivers)

          nearDriverRes.data.drivers.forEach((driver) => {
            let zappCarIcon = L.icon({
              iconUrl: `http://zapptaxi.com:3005/images/typeCarsIcon/typecar${_carType}.png`,
              iconSize: [20, 32]
            })

            let zappCarMarker = L.marker([driver.lat, driver.lng], {
              icon: zappCarIcon
            }).addTo(map)

            zappCarMarker.on('click', (e) => {
              setNearDriver(driver)
              setIsDriverSelected(true)
            })

            _nearDriversMarkers.push(zappCarMarker)
          })
        }
      }
    } catch (e) {}
  }

  const onPassengerIdChanged = async (e) => {
    setPassengerId(e.target.value)

    if (e.target.value.length === 11) {
      try {
        let getPassengerReq = await axios({
          method: 'post',
          url: config.app.BASE_URL + 'panel/passenger/by/phonenumber',
          headers: {
            Authorization: `Bearer ${db.get('token').value()}`,
            'Content-Type': 'application/json'
          },
          data: {
            phoneNumber: e.target.value
          }
        })

        setIsNewPassenger(true)

        if (getPassengerReq.data.status === 200) {
          setPassengerFullName(getPassengerReq.data.passenger.name)
        } else {
          setPassengerFullName('')
        }
      } catch (e) {
        console.log(e.message)
      }
    } else {
      setIsNewPassenger(false)
    }
  }

  const onpassengerFullNameChanged = (e) => {
    setPassengerFullName(e.target.value)
  }

  const onTripRequest = async (e) => {
    if (
      !passengerId ||
      !latPoint ||
      !lngPoint ||
      !nearDriver.phoneNumber ||
      carType === null ||
      tripType === null ||
      tripIsTwoWay === null ||
      tripStopTime === null
    ) {
      return
    }
    console.log('milaaaaaaaaaaaaaaaaaaad')
    let ends = []

    if (lngPoint.length == 2) {
      ends[0] = {
        coordinates: lngPoint,
        address: lngAddress
      }
    }
    if (lng2Point.length == 2) {
      ends[1] = {
        coordinates: lng2Point,
        address: lng2Address
      }
    }

    try {
      let tripReqRes = await axios({
        method: 'post',
        url: config.app.BASE_URL + 'panel/trip/request',
        headers: {
          Authorization: `Bearer ${db.get('token').value()}`,
          'Content-Type': 'application/json'
        },
        data: {
          passengerId: passengerId,
          passengerFullName: passengerFullName,
          start: {
            coordinates: latPoint,
            address: latAddress
          },
          ends: ends,
          driverPhoneNumber: nearDriver.phoneNumber,
          carType: carType,
          tripType: tripType,
          options: {
            isTwoWay: tripIsTwoWay,
            stopTime: tripStopTime
          }
        }
      })
      console.log('tripReqRes : ', tripReqRes)
      if (tripReqRes.data.status == 200) {
        setAlert({
          status: true,
          message: tripReqRes.data.message
        })
      }

      setAlert({
        status: true,
        message: tripReqRes.data.message
      })
    } catch (e) {
      setAlert({
        status: true,
        message: e.message
      })
    }
  }

  const onChangeAddressInput = (e) => {
    setCurrentAddress(e.target.value)
  }

  return (
    <div className="tripRequestRoot ">
      <div className="map">
        <div id="tripRequestMap" />
      </div>
      <div className="panel">
        <Row className="temp">
          <Col>
            <Card className="bg-light shadow border-0 ">
              <CardHeader className="PrimaryColor">موقعیت یابی</CardHeader>
              <CardBody>
                <Row className="withdivider" />

                <Row className="mt-2 mb-2">
                  <Col>
                    <Label className="d-block mr-sm-2">نوع خودرو</Label>

                    <Input
                      type="select"
                      value={carType}
                      onChange={onCarTypeChanged}
                      className="text-right"
                    >
                      <option value={0}>تاکسی زپ</option>
                      <option value={1}>تاکسی بانوان زپ</option>
                      <option value={8}>پیک زپ</option>
                      <option value={6}>وانت زپ</option>
                      <option value={2}>ون زپ</option>
                      <option value={7}>امداد خودرو زپ</option>
                      <option value={4}>کامیون زپ</option>
                    </Input>

                    <Label for="exampleEmail" className="d-block mt-3 mr-sm-2">
                      آدرس :
                    </Label>
                    <Input
                      type="text"
                      name="currentAddress"
                      id="currentAddress"
                      className="text-right"
                      value={currentAddress}
                      onChange={onChangeAddressInput}
                    />

                    <Button
                      className="mt-3 mb-2 btn-dark"
                      onClick={onLatAddressClicked}
                    >
                      ثبت مبدا
                    </Button>

                    <Button
                      className="mt-3 mb-2 ml-2 btn-dark"
                      onClick={onLngAddressClicked}
                    >
                      ثبت مقصد
                    </Button>
                    <Button
                      className="mt-3 mb-2 ml-2 btn-dark"
                      onClick={onLng2AddressClicked}
                    >
                      ثبت مقصد دوم
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-2 mb-2">
                  <Col>
                    <Label className="d-inline-block">مبدا :</Label>
                    <p className="d-inline-block ml-2">
                      {latAddress
                        ? latAddress
                        : 'نقطه ای به عنوان مبدا تعیین نشده است'}
                    </p>
                  </Col>
                </Row>

                <Row className="mt-2 mb-2">
                  <Col>
                    <Label className="d-inline-block">مقصد :</Label>
                    <p className="d-inline-block ml-2">
                      {lngAddress
                        ? lngAddress
                        : 'نقطه ای به عنوان مقصد ثبت نشده است'}
                    </p>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="bg-light shadow border-0 ">
              <CardHeader className="PrimaryColor">اطلاعات مسافر</CardHeader>
              <CardBody>
                <Row className="withdivider" />

                <Row className="mt-2 mb-2">
                  <Col>
                    <div className={isNewPassenger ? 'd-block' : 'd-none'}>
                      <Label className="d-block mr-sm-2">
                        نام و نام خانوادگی :
                      </Label>
                      <Input
                        type="text"
                        name="fullname"
                        id="fullname"
                        className="text-right"
                        onChange={onpassengerFullNameChanged}
                        value={passengerFullName}
                      />
                    </div>

                    <div>
                      <Label for="exampleEmail" className="d-block mr-sm-2">
                        شماره همراه یا شماره اشتراک مسافر :
                      </Label>
                      <Input
                        type="text"
                        name="passengerId"
                        id="passengerId"
                        className="text-right"
                        onChange={onPassengerIdChanged}
                        value={passengerId}
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="bg-light shadow border-0 ">
              <CardHeader className="PrimaryColor">اطلاعات راننده</CardHeader>
              <CardBody>
                <Row className="withdivider" />

                <Row className="mt-2">
                  <Col>
                    <div className={isDriverSelected ? 'd-block' : 'd-none'}>
                      <div className="d-flex flex-row ml-2">
                        <img
                          width="64px"
                          height="64px"
                          className="d-inline-block"
                          src={
                            nearDriver
                              ? config.app.DRIVER_IMAGE_URL + nearDriver.avatar
                              : 'بدون عکس'
                          }
                          alt="عکس راننده"
                        />
                        <span className="d-inline-flex flex-column">
                          <div className="d-inline-block  ">
                            <p className="d-inline-block ml-2">
                              {nearDriver ? nearDriver.name : 'بدون نام'}
                            </p>
                          </div>

                          <div className="d-inline-block ">
                            <p className="badge badge-info d-inline-block ml-2">
                              {nearDriver ? nearDriver.phoneNumber : 'بدون نام'}
                            </p>
                          </div>
                        </span>
                      </div>
                    </div>
                    <div className="d-inline-block  m-2">
                      <p className="d-inline-block ml-2">
                        {nearDriver
                          ? nearDriver.car.name +
                            ' ' +
                            nearDriver.car.color +
                            ' با پلاک: ' +
                            nearDriver.car.plate
                          : 'بدون نام'}
                      </p>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Card className="bg-light shadow border-0 ">
              <CardHeader className="PrimaryColor">اطلاعات تکمیلی</CardHeader>
              <CardBody>
                <Row className="withdivider" />

                <Row className="mt-2 mb-2">
                  <Col>
                    <div>
                      <div className="alignTop">
                        <div className="d-inline-block pr-3  ">
                          <Label for="exampleEmail" className="d-block mr-sm-2">
                            توقف در مسیر (به دقیقه) :
                          </Label>

                          <Input
                            type="select"
                            value={tripStopTime}
                            onChange={onStopTimeChanged}
                          >
                            <option value={5}>0-5</option>
                            <option value={10}>5-10</option>
                            <option value={15}>10-15</option>
                            <option value={20}>15-20</option>
                            <option value={25}>20-25</option>
                            <option value={30}>25-30</option>
                            <option value={45}>30-45</option>
                            <option value={60}>45-60</option>
                          </Input>
                        </div>

                        <div className="d-inline-block  ">
                          <Label for="exampleEmail" className="d-block mr-sm-2">
                            رفت و برگشتی :
                          </Label>

                          <div>
                            <label className="switch">
                              <input
                                defaultChecked={false}
                                type="checkbox"
                                onChange={handletoggle}
                              />
                              <span className="slider round" />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="d-inline-block ">
                        <Label for="exampleEmail" className="d-block mr-sm-2">
                          هزینه :
                        </Label>
                        <p className="badge badge-dark d-inline-block ml-2">
                          {tripCost ? tripCost + ' تومان ' : '0 تومان'}
                        </p>
                        <button
                          className="badge badge-info d-inline-block ml-2"
                          onClick={getPrice}
                        >
                          استعلام هزینه
                        </button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <Button
              onClick={onTripRequest}
              className={
                isDriverSelected
                  ? 'd-block btn-info m-auto btn-lg w-100'
                  : 'd-none'
              }
            >
              ثبت درخواست
            </Button>
          </Col>
        </Row>
        <div className="card pt-4 pl-2 ">
          <ul className="description">
            <li>
              {' '}
              <p>
                با کلیک کردن روی نقشه موقعیت مورد نظر خود را پیدا کنید سپس با
                زدن روی دکمه "ثبت این مکان" آن نقطه را به عنوان مبدا یا مقصد
                تعیین کنید
              </p>
            </li>
            <li>
              {' '}
              <p>برای انتخاب راننده بر روی آیکون آنها بر روی نقشه کلیک کنید</p>
            </li>
            <li>
              {' '}
              <p>
                جهت گرفتن تاکسی برای مسافرینی که در زپ عضو نیستند کافیست شماره
                همراه آنها را در فیلد مربوطه وارد کنید سپس فیلد نام را تکمیل
                کنید تا همزمان با درخواست ثبت نام شوند
              </p>
            </li>
          </ul>
        </div>
      </div>

      <Modal isOpen={alert.status} toggle={handleAlertBtn}>
        <ModalBody>{alert.message}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAlertBtn}>
            باشه
          </Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  )
}
