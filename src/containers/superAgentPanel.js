import React, { Component } from "react";
import axios from "axios";
import Chart from "../components/chart";
import config from "../config";
import db from "../helpers/localDB";
import { Container ,Row, Col , Card, CardTitle,CardText,CardGroup } from "reactstrap";

class SuperAgentPanel extends Component {
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
            driverCount:result.data.stat.driverCount,
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
            params:{'byDay[0]': 0,'byDay[1]':30}
        });
        if (result.data.status === 200) {
          this.setState({
            chartData:result.data.trips,
            chartDataByTime:result.data.trips.byDay

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
 
  

  render() {
   
    return (
      <Container>
        <Row>
          <Col>
          <CardGroup>
          <Card body inverse color="warning">
              <CardTitle>کل سفر ها</CardTitle>
              <CardText>
              {this.state.tripsCount}
              </CardText>
            </Card>
            <Card body inverse color="danger">
              <CardTitle>تعداد رانندگان</CardTitle>
              <CardText>
                {this.state.driverCount}
              </CardText>
            </Card>
            <Card body inverse color="primary">
              <CardTitle>تعداد مسافران</CardTitle>
              <CardText>
              {this.state.passengersCount}
              </CardText>
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
          
          <Chart chartData={this.state.chartDataByTime} datakey='tripsIncome' title="درآمد به تومان"></Chart>
          <Chart chartData={this.state.chartDataByTime}  datakey='tripsCount' title="تعداد سفر ها"></Chart>

          </Col>
        </Row>
      </Container>
    );
  }
}

export default SuperAgentPanel;


