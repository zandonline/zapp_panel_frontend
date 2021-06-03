import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Container, Card, CardBody, Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import Map from "./map";
import config from "../config";
import db from "../helpers/localDB";

class mapList extends Component {


    constructor(props) {
        super(props);
        this.state = {
            mapList: [],
            priceData: {},
            page: 1,
            alert: {
                status: false,
                message: ""
            }
        }
        this.loadMaps();
    }

    async loadMaps(page = 1) {
        try {

            let result = await axios({
                method: 'get',
                url: config.app.BASE_URL + 'area/price/rules?page=' + page,
                headers: { 'Authorization': `Bearer ${db.get("token").value()}` },
            });
            if (result.data.status === 200) {
                this.setState({ mapList: result.data.areas });
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

    async handleActiveBtn(m, e) {

        try {

            let result = await axios({
                method: 'delete',
                url: config.app.BASE_URL + 'area/price/rules',
                headers: { 'Authorization': `Bearer ${db.get("token").value()}` },
                data: { areaId: m }
            });

            if (result.data.status === 200) {

                this.loadMaps();
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
                    status: true,
                    message: "خطایی پیش آمده است"
                }
            })
        }

    }

    render() {
        return (
            <Container fluid={true} >


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
                        <Link to={{ pathname: 'rules/add' }} className='topMargin2 btn btn-danger'>  افزودن محدوده جدید </Link>
                    </Col>
                </Row>
                <Row className='temp'>
                    <Col md={{ size: 12 }} >

                        {
                            this.state.mapList.map((item) => (
                                <Card key={item.id} className="bg-light shadow border-0 mrginTop">

                                    <CardBody>
                                        <Row>
                                            <Col md={{ size: 7 }}>

                                                <div className="table-responsive">
                                                    <table className="table align-items-center table-light">
                                                        <thead className="thead-primary">
                                                            <tr>
                                                                <th scope="col">شهر</th>
                                                                <th scope="col">قیمت به ازای هر کیلومتر</th>
                                                                <th scope="col">قیمت ثابت</th>
                                                                <th scope="col">حداکثر محدوده قیمت ثابت</th>
                                                                <th scope="col">درصد هزینه رفت و برگشتی</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <th scope="row">{item.city}</th>
                                                                <th scope="row">{item.defaultCost.costPerKm}</th>
                                                                <th scope="row">{item.defaultCost.constantCost}</th>
                                                                <th scope="row">{item.defaultCost.maxDistance}</th>
                                                                <th scope="row">{item.defaultCost.twoWayPercent}</th>

                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <Row>
                                                    <button onClick={this.handleActiveBtn.bind(this, item.id)} type="button" className="btn btn-outline-danger topMargin2">

                                                        {item.isActive ? 'غیر فعال کردن محدوده' : 'فعال کردن محدوده'}
                                                    </button>

                                                    <Link to={{ pathname: 'rules/add', state: item }} className="btn btn-outline-danger topMargin2">ویرایش </Link>

                                                </Row>
                                            </Col>
                                            <Col md={{ size: 5 }}>
                                                <Map id={item.id} mapPosition={item.areaPolygon[0][0]} points={item.areaPolygon}></Map>

                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>

                            )
                            )
                        }


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
                            <span className='Mypagination'>{this.state.page}</span>
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


        )

    }
}
export default mapList;