import React, { Component } from "react";
import {  Row, Col , FormGroup ,Input , Label} from "reactstrap";
import config from "../config";
import db from "../helpers/localDB";
import axios from 'axios';
import Select from 'react-select'

class city extends Component {
    constructor(props) {
        super(props);
        this.state = {
            citys:[],
            cityId:''
        }
        this.loadcities();
      }

      
    async loadcities() {
        try {
    
            let result = await axios({
                method: 'get',
                url: config.app.BASE_URL + 'city' ,
                headers: { 'Authorization': `Bearer ${db.get("token").value()}` },
               
            });
            if (result.data.status === 200) {
           
              this.setState({
                citys:result.data.cities,
                
    
              });


              let citiesArr = [];
              for(let _city of result.data.cities){
                citiesArr.push( { value: _city._id, label: _city.name });
          
              }
              this.setState({
                cities:citiesArr
              });



            }
    
    
        } catch (e) {
    
            console.log(e.message);
    
        }
    
      }
      handleCityInput = e => {
        // e.preventDefault();
        // this.setState({
        //     cityId: e.target.value
        // });
        this.setState({
            cityId: e.value
        });
        

        this.props.onSelectCity(e.value); 
    
      };
render() {
   
    return (
        <Row>
        <Col md='12'>
            <FormGroup>
            <Label for="exampleSelect">شهر </Label>
        
            {/* <Input  type="select" name="select"  onChange={this.handleCityInput} id="selectTime"> */}
            <Select id="selectTime" onChange={this.handleCityInput} options={this.state.cities}/>
{/* 
            {this.state.citys.map((item,index)=>{
                return(
                <option key={index} value={item._id} >{item.name}</option>
            )} */}


            {/* )} */}
            {/* </Input> */}
            </FormGroup>
        </Col>
       </Row>
    )
}
}
export default city;