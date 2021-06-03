import React, { Component } from "react";
import axios from "axios";
import Chart from "../../components/chart";
import config from "../../config";
import db from "../../helpers/localDB";
import { Container ,Row, Col , Card, CardTitle,CardText,CardGroup ,Button} from "reactstrap";
import { DatePicker} from "react-advance-jalaali-datepicker";
import moment from 'jalali-moment';
import ReactExport from 'react-export-excel'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn


class Panel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      incomeData: [
        { name: "شنبه", point: 120000 },
        { name: "یکشنبه", point: 150000 },
        { name: "دوشنبه", point: 90000 },
        { name: "سه شنبه", point: 80000 },
        { name: "چهارشنبه", point: 160000 },
        { name: "پنج شنبه", point: 212000 },
        { name: "جمعه", point: 250000 }
      ],
      tripData: [
        { name: "شنبه", point: 20 },
        { name: "یکشنبه", point: 33 },
        { name: "دوشنبه", point: 12 },
        { name: "سه شنبه", point: 35 },
        { name: "چهارشنبه", point: 85 },
        { name: "پنج شنبه", point: 43 },
        { name: "جمعه", point: 9 }
      ],
      chartData:[],
      chartDataByTime:[],
      driverCount:'',
      passengersCount:'',
      tripsCount:'',
      timeSelect:'',
      startDate:'',
      endDate:'',
      newArr:[]
      
    };
    this.loadCardsData();
    this.loadChartData();
   
  }
  async loadCardsData() {
    try {

        let result = await axios({
            method: 'get',
            url: config.app.BASE_URL + 'panel/stat/brief' ,
            headers: { 'Authorization': `Bearer ${db.get("token").value()}` },
        });
        if (result.data.status === 200) {
          this.setState({
            driverCount:result.data.stat.driversCount,
            passengersCount:result.data.stat.passengersCount,
            tripsCount:result.data.stat.tripsCount,

          });
        }


    } catch (e) {

        console.log(e.message);

    }

  }

  async loadChartData() {
    
    try {

        let result = await axios({
            method: 'get',
            url: config.app.BASE_URL + '/panel/stat/trips' ,
            headers: { 'Authorization': `Bearer ${db.get("token").value()}` },
          //   params:{'byDay[0]': 0,'byDay[1]':7,'byWeek[0]':0,'byWeek[1]':3,
          //  'byMonth[0]':0,'byMonth[1]':2
          //   }
          params:{'startDate':this.state.startDate,'endDate':this.state.endDate}
        });
        if (result.data.status === 200) {
          let tripData = result.data.trips.byDay.map((trip)=>{
              return {
                name:moment(trip.name).locale('fa').format('YYYY/MM/DD'),
                tripsCounts:trip.tripsCounts,
                tripsIncome:trip.tripsIncome
              }
          });
          // for(var i=0;i<result.data.trips.byDay.length;i++){

              // this.state.newArr.push({
              //  "name": result.data.trips.byDay[i]._id.year+'/'+result.data.trips.byDay[i]._id.month,
              //  "tripsIncome":result.data.trips.byDay[i].tripsIncome
              // })

          // }
        
          this.setState({
            chartData:result.data.trips,
            chartDataByTime:tripData,

          });
        }


    } catch (e) {

        console.log(e.message);

    }

  }

 
  handleChange= e => {
    this.setState({
      timeSelect:e.target.value,
      chartDataByTime:this.state.chartData[e.target.value]
    });
   
  
  }

  changestartDate = (e) => {

    this.setState({
     
      startDate:e

    });
  
  }
  changeEndDate = (e) => {

    this.setState({
     
      endDate:e
    

    });
   
  }

  getNewChart=()=>{
      this.loadChartData();
  }

  render() {
   
    return (
      <Container>
        <Row>
          <Col>
            <CardGroup>
              <Card body color="light">
                <CardTitle>کل سفر ها</CardTitle>
                <CardText>{this.state.tripsCount}</CardText>
              </Card>
              <Card body color="light">
                <CardTitle>تعداد رانندگان</CardTitle>
                <CardText>{this.state.driverCount}</CardText>
              </Card>
              <Card body color="light">
                <CardTitle>تعداد مسافران</CardTitle>
                <CardText>{this.state.passengersCount}</CardText>
              </Card>
            </CardGroup>
            {/* <Card className='cardmargin'>
            <Row>
            <Col md='4'>
                <FormGroup>
                  <Label for="exampleSelect">انتخاب زمان</Label>
                  <Input value={this.state.timeSelect}  onChange={this.handleChange}  type="select" name="select" id="selectTime">
                    <option value='byDay'>روز</option>
                    <option value='byMonth'>هفته</option>
                    <option value='byWeek'>ماه</option>
              
                  </Input>
              </FormGroup>
            </Col>
           
            </Row>
            <Row>
         
          
            </Row>
            
            </Card> */}
            <Card className="cardmargin">
              <Row>
                <Col md="4">
                  <label>تاریخ شروع</label>
                  <DatePicker
                    placeholder="انتخاب تاریخ "
                    format="jYYYY/jMM/jDD"
                    id="dateTimePicker"
                    onChange={this.changestartDate}
                  />
                </Col>
                <Col md="4">
                  <label>تاریخ پایان</label>
                  <DatePicker
                    placeholder="انتخاب تاریخ "
                    format="jYYYY/jMM/jDD"
                    id="dateTimePicker2"
                    onChange={this.changeEndDate}
                  />
                </Col>
                <Col md="2">
                  <Button
                    color="info"
                    className="mrginTop"
                    onClick={this.getNewChart}
                  >
                    مشاهده
                  </Button>
                </Col>
              </Row>
            </Card>

            <Chart
              chartData={this.state.chartDataByTime}
              datakey="tripsIncome"
              title="درآمد به تومان"
            ></Chart>
            <Chart
              chartData={this.state.chartDataByTime}
              datakey="tripsCounts"
              title="تعداد سفر ها"
            ></Chart>
          </Col>
        </Row>
        <Row>
          <ExcelFile
            element={
              <button className="btn btn-success m-3 ">گرفتن خروجی اکسل</button>
            }
          >
            <ExcelSheet data={this.state.chartDataByTime} name="پنل">
              <ExcelColumn label="تاریخ" value="name" />
              <ExcelColumn label="درآمد به تومان" value="tripsIncome" />
              <ExcelColumn label="تعداد سفر ها" value="tripsCounts" />
            </ExcelSheet>
          </ExcelFile>
        </Row>
      </Container>
    )
  }
}

export default Panel;
