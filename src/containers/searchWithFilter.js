import React, { Component } from "react";
import { Button, Row, Col,FormGroup,Input } from "reactstrap";

let  checkedStatus=[];
class searchWithFilter extends Component {
    state={
        query:'',
        
        secondStatus:false,
        thirdStatus:false,
       
    }
   
    handleLangChange = (e) => {
     
         
        this.setState({query: e.target.value});
      
    }
    handlestatus=(e)=>{
        
        if(e.target.checked){
           checkedStatus.push(0);
        }else{
            while (checkedStatus.indexOf(0) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(0), 1);
              }
        }
        
    }
    handlestatus1=(e)=>{
        this.setState({
            firstStatus:e.target.checked
        })
        if(e.target.checked){
           checkedStatus.push(1);
        }else{
            while (checkedStatus.indexOf(1) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(1), 1);
              }
        }
        
    }
    handlestatus2=(e)=>{
        this.setState({
            firstStatus:e.target.checked
        })
        if(e.target.checked){
           checkedStatus.push(2);
        }else{
            while (checkedStatus.indexOf(2) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(2), 1);
              }
        }
        
    }
    handlestatus3=(e)=>{
        this.setState({
            firstStatus:e.target.checked
        })
        if(e.target.checked){
           checkedStatus.push(3);
        }else{
            while (checkedStatus.indexOf(3) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(3), 1);
              }
        }
        
    }
    handlestatus4=(e)=>{
        this.setState({
            firstStatus:e.target.checked
        })
        if(e.target.checked){
           checkedStatus.push(4);
        }else{
            while (checkedStatus.indexOf(4) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(4), 1);
              }
        }
        
    }
    passData=()=>{
        this.props.onSelectLanguage(this.state.query,checkedStatus); 
        //console.log(checkedStatus)
    }
    render(){
        return(
           
            <Row  className='mrginTop'>
                <Col md='6'>
                <FormGroup>
                <label>شماره موبایل</label>
                <Input type="text" value={this.state.query}  placeholder="جستجو"  onChange={this.handleLangChange}/>
                </FormGroup>
                </Col>
                <Col  md='1'>
                <Button color='info' className="mrginTop" onClick={this.passData}>جستجو
               
                </Button>
                </Col>
                <Col md='11'>
                <FormGroup check>
                <label className="checkBoxcontainer">عادی
                    <input  onChange={this.handlestatus} type="checkbox" />
                    <span className="checkmark"></span>
                </label>
                
                 <label className="checkBoxcontainer"> در حین درخواست
                    <input  onChange={this.handlestatus1} type="checkbox" />
                    <span className="checkmark"></span>
                </label>
               
                 <label className="checkBoxcontainer">  در حال  رفتن به مبدا
                    <input  onChange={this.handlestatus2} type="checkbox" />
                    <span className="checkmark"></span>
                </label>
                
                  <label className="checkBoxcontainer"> در حال  رفتن به مقصد
                    <input  onChange={this.handlestatus3} type="checkbox" />
                    <span className="checkmark"></span>
                </label>
                
                 <label className="checkBoxcontainer">  در حال  امتیازدهی 
                    <input  onChange={this.handlestatus4} type="checkbox" />
                    <span className="checkmark"></span>
                </label>
                {/* <Label check>
                    <Input  onChange={this.handlestatus4} type="checkbox" />{' '}
                در حال  امتیازدهی 
                </Label> */}
                     </FormGroup>
                </Col>
              
            </Row>
           
        )
       
    }

}
export default searchWithFilter;