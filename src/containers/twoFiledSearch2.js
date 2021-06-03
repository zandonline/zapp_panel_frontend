import React, { Component } from "react";
import { Button, Row, Col,FormGroup,Input } from "reactstrap";

let  checkedStatus='';

class twoFieldSearch2 extends Component {
    state={
        query1:'',
        query2:''
    }
    handleLangChange1 = (e) => {
     
         
        this.setState({query1: e.target.value});
      
    }
    handleLangChange2 = (e) => {
     
         
        this.setState({query2: e.target.value});
      
    }

    handlestatus=(e)=>{
        
        checkedStatus=4;
        
        // if(e.target.checked){
        //    checkedStatus.push(4);
        // }else{
        //     while (checkedStatus.indexOf(4) !== -1) {
        //         checkedStatus.splice(checkedStatus.indexOf(4), 1);
        //       }
        // }
        
    }
    handlestatus1=(e)=>{
        checkedStatus=5;
       
        // if(e.target.checked){
        //    checkedStatus.push(5);
        // }else{
        //     while (checkedStatus.indexOf(5) !== -1) {
        //         checkedStatus.splice(checkedStatus.indexOf(5), 1);
        //       }
        // }
        
    }
    handlestatus2=(e)=>{
        checkedStatus=6;
        // if(e.target.checked){
        //    checkedStatus.push(6);
        // }else{
        //     while (checkedStatus.indexOf(6) !== -1) {
        //         checkedStatus.splice(checkedStatus.indexOf(6), 1);
        //       }
        // }
        
    }
    handlestatus3=(e)=>{
        checkedStatus=7;
        // if(e.target.checked){
        //    checkedStatus.push(7);
        // }else{
        //     while (checkedStatus.indexOf(7) !== -1) {
        //         checkedStatus.splice(checkedStatus.indexOf(7), 1);
        //       }
        // }
        
    }
    handlestatus4=(e)=>{
        checkedStatus=8;
        // if(e.target.checked){
        //    checkedStatus.push(8);
        // }else{
        //     while (checkedStatus.indexOf(8) !== -1) {
        //         checkedStatus.splice(checkedStatus.indexOf(8), 1);
        //       }
        // }
        
    }
    handlestatus5=(e)=>{
        checkedStatus=2;
        // if(e.target.checked){
        //    checkedStatus.push(8);
        // }else{
        //     while (checkedStatus.indexOf(8) !== -1) {
        //         checkedStatus.splice(checkedStatus.indexOf(8), 1);
        //       }
        // }
        
    }
  

  
    passData=()=>{
        this.props.onSelectLanguage(this.state.query1,this.state.query2,checkedStatus); 
    }
    
    render(){
        return(
            // <Form>
            <Row  className='mrginTop'>
                <Col md='4'>
                    <FormGroup>
                        <label>{this.props.labelone}</label>
                    <Input type="text" value={this.state.query1}  placeholder="جستجو"  onChange={this.handleLangChange1}/>
                    </FormGroup>
               
                </Col>
                <Col md='4'>
                    <FormGroup>
                        <label>{this.props.labeltwo}</label>
                    <Input type="text" value={this.state.query2}  placeholder="جستجو"  onChange={this.handleLangChange2}/>
                    </FormGroup>
                </Col>
                <Col  md='1'>
                <Button color='info' className="mrginTop" onClick={this.passData}>جستجو
               
                </Button>
                </Col>
                <Col md="12">نوع خودرو</Col>
                <Col md='12'>
                <FormGroup check>
                        <label className="radiocontainer">کامیون
                            <input  onChange={this.handlestatus} type="radio" name='radio'/>
                            <span className="checkmark"></span>
                        </label>
                        
                        <label className="radiocontainer">جرثقیل
                            <input  onChange={this.handlestatus1} type="radio"  name='radio'/>
                            <span className="checkmark"></span>
                        </label>
                    
                        <label className="radiocontainer"> وانت
                            <input  onChange={this.handlestatus2} type="radio" name='radio'/>
                            <span className="checkmark"></span>
                        </label>
                        
                        <label className="radiocontainer"> امداد خودرو
                            <input  onChange={this.handlestatus3} type="radio" name='radio' />
                            <span className="checkmark"></span>
                        </label>
                        
                        <label className="radiocontainer">پیک
                            <input  onChange={this.handlestatus4} type="radio" name='radio'/>
                            <span className="checkmark"></span>
                        </label>

                        <label className="radiocontainer">مینی بوس
                            <input  onChange={this.handlestatus5} type="radio" name='radio'/>
                            <span className="checkmark"></span>
                        </label>
                      
               
                     </FormGroup>
                </Col>
               
            </Row>
            //</Form> 
        )
       
    }

}
export default twoFieldSearch2;