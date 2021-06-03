import React, { Component } from "react";
import axios from "axios";
import config from "../config";
import db from "../helpers/localDB";
import { Table, Container, Row, Col } from "reactstrap";
//import Search from './search';
import Search from './mainSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class PassengerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passengers: [],
      page: 1,
      searchData:[],
      showLoader:false,
      fiedls:[
        {'name':'شماره موبایل'},
        {'name':'نام'}
    ],
    };

    this.loadPassengers(1,this.state.searchData);
  }

  async loadPassengers(page = 1,search=[]) {
 
    this.state.showLoader=true;
    try {
      let result = await axios({
        url: config.app.BASE_URL + "panel/index/passengers" ,
        method: "post",
        headers: {
          Authorization: `Bearer ${db.get("token").value()}`,
          "Content-Type": "application/json"
        },
        data:{
          "search":{"phoneNumber":search[0],"name":search[1]},

      //    search:search
        },
        params:{
          page:page
        }
      });
    
      this.state.showLoader=false;
      if (result.data.status === 200) {
        if (result.data.passengers.length === 0) {
          this.setState({
            passengers: []
          });
        } else {
          this.setState({
            passengers: result.data.passengers
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

    if (currentPage >= 1 && this.state.passengers.length > 0) {
      this.setState({
        page: currentPage
      });

      this.loadPassengers(currentPage);
    }
  };

  handlePrevBtn = e => {
    e.preventDefault();
    let currentPage = this.state.page - 1;

    if (currentPage >= 1) {
      this.setState({
        page: currentPage
      });

      this.loadPassengers(currentPage);
    }
  };
  handleSearch = (searchData) => { 
    console.log(searchData);
    this.setState({
      searchData : searchData,
      page:1
    });
    this.loadPassengers(1,searchData);
  };
  
  render() {
    return (
      <Container>
        <Search fiedls={this.state.fiedls} checkboxes={[]} onSelectLanguage={this.handleSearch}></Search>


          {/*   
            <Search onSelectLanguage={this.handleSearch} title='شماره موبایل'></Search>
          */}

         <Row className="centerize height1">
         {
           this.state.showLoader?
            <FontAwesomeIcon icon="spinner" className="Loader" /> 
            :
            ''
          }
          </Row>
        <Row>
          <Col>
            <div className="table-responsive">
              <Table className="mt-5">
                <thead>
                  <tr>
                    <th className="text-right">شماره همراه</th>
                    <th className="text-right">نام و نام خانوادگی</th>
                    <th className="text-right">وضعیت کاربری</th>
                    <th className="text-right">وضعیت اتصال</th>
                    <th className="text-right">کیف پول</th>
                    <th className="text-right">وضعیت سفر</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.passengers.length > 0 ? (
                    this.state.passengers.map(passenger => {
                      return (
                        <tr key={passenger.id}>
                          <td className="text-right">
                            {passenger.phoneNumber}
                          </td>
                          <td className="text-right">{passenger.fullName}</td>
                          <td className="text-right">
                            <span className="badge badge-primary">
                              {passenger.isActive === 1 ? "فعال" : "غیر فعال"}
                            </span>
                          </td>
                          <td className="text-right">
                            <span className="badge badge-dark">
                              {passenger.isOnline === 1 ? "آنلاین" : "آفلاین"}
                            </span>
                          </td>
                          <td className="text-right">{passenger.wallet}</td>
                          <td className="text-right">{passenger.status}</td>

                          {/* <td className="text-right">
                        <Input value={this.state.tripStatus!==null?this.state.tripStatus:trip.status} type="select" id="tripStatus" onChange={this.handleTripStatusInput}>
                          <option value={2000}>انجام شده</option>
                          <option value={-1000}>کنسل شده</option>
                          <option value={1000}>در حال بررسی</option>
                        </Input>
                      </td> */}
                          {/* <td className="text-right">
                        <Input type="text" id="tripCost" value={this.state.tripCost !== null ? this.state.tripCost : trip.cost} onChange={this.handleTripCostInput} />
                      </td> */}

                          {/* <td className="text-right">
                          <Button color="danger" value={
                            [trip.id,trip.status,trip.cost]
                          } onClick={this.handleEditTripBtn} size="sm">اعمال تغییرات</Button>

                      </td> */}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td>
                        <p className="text-right">مسافری وجود ندارد</p>
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
                  this.state.page + 1 >= 1 && this.state.passengers.length > 0
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
    );
  }
}

export default PassengerList;
