import React, { Component } from "react";
import { Button, Row, Col,FormGroup,Input } from "reactstrap";

let  checkedStatus=[];
let checkedType=[];
let paymentType='';
class twoFieldSearch extends Component {
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
        
        if(e.target.checked){
           checkedStatus.push(0);
        }else{
            while (checkedStatus.indexOf(0) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(0), 1);
              }
        }
        
    }
    handlestatus1=(e)=>{
    
        if(e.target.checked){
           checkedStatus.push(1);
        }else{
            while (checkedStatus.indexOf(1) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(1), 1);
              }
        }
        
    }
    handlestatus2=(e)=>{
       
        if(e.target.checked){
           checkedStatus.push(2);
        }else{
            while (checkedStatus.indexOf(2) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(2), 1);
              }
        }
        
    }
    handlestatus3=(e)=>{
        
        if(e.target.checked){
           checkedStatus.push(2000);
        }else{
            while (checkedStatus.indexOf(2000) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(2000), 1);
              }
        }
        
    }
    handlestatus4=(e)=>{
       
        if(e.target.checked){
           checkedStatus.push(100);
        }else{
            while (checkedStatus.indexOf(100) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(100), 1);
              }
        }
        
    }
    handlestatus5=(e)=>{
       
        if(e.target.checked){
           checkedStatus.push(200);
        }else{
            while (checkedStatus.indexOf(200) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(200), 1);
              }
        }
        
    }
    handlestatus6=(e)=>{
       
        if(e.target.checked){
           checkedStatus.push(-1);
        }else{
            while (checkedStatus.indexOf(-1) !== -1) {
                checkedStatus.splice(checkedStatus.indexOf(-1), 1);
              }
        }
        
    }

    handleType=(e)=>{
        if(e.target.checked){
            checkedType.push(0);
         }else{
             while (checkedType.indexOf(0) !== -1) {
                checkedType.splice(checkedType.indexOf(0), 1);
               }
         }
    }

    handleType1=(e)=>{
        if(e.target.checked){
            checkedType.push(1);
         }else{
             while (checkedType.indexOf(1) !== -1) {
                checkedType.splice(checkedType.indexOf(1), 1);
               }
         }
    }

    handleType2=(e)=>{
        if(e.target.checked){
            checkedType.push(2);
         }else{
             while (checkedType.indexOf(2) !== -1) {
                checkedType.splice(checkedType.indexOf(2), 1);
               }
         }
    }
    handlePaymentType1=(e)=>{
        // if(e.target.checked){
        //     paymentType.push(0);
        //  }else{
        //      while (paymentType.indexOf(0) !== -1) {
        //         paymentType.splice(paymentType.indexOf(0), 1);
        //        }
        //  }
         paymentType=0;
    }
    handlePaymentType2=(e)=>{
        // if(e.target.checked){
        //     paymentType.push(1);
        //  }else{
        //      while (paymentType.indexOf(1) !== -1) {
        //         paymentType.splice(paymentType.indexOf(1), 1);
        //        }
        //  }
        paymentType=1;
    }

    passData=()=>{
        this.props.onSelectLanguage(this.state.query1,this.state.query2,checkedStatus,checkedType,paymentType); 
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
                <Col md='12'>
                <div className='titleMargin'>وضعیت سفر </div>
                <FormGroup check>
                        <label className="checkBoxcontainer">موقت
                            <input  onChange={this.handlestatus} type="checkbox" />
                            <span className="checkmark"></span>
                        </label>
                        
                        <label className="checkBoxcontainer">در حال رفتن به مبدا
                            <input  onChange={this.handlestatus1} type="checkbox" />
                            <span className="checkmark"></span>
                        </label>
                    
                        <label className="checkBoxcontainer"> رزرو
                            <input  onChange={this.handlestatus2} type="checkbox" />
                            <span className="checkmark"></span>
                        </label>
                        
                        <label className="checkBoxcontainer"> رزرو تایید شده
                            <input  onChange={this.handlestatus3} type="checkbox" />
                            <span className="checkmark"></span>
                        </label>
                        
                        <label className="checkBoxcontainer">در حال رفتن به مقصد 
                            <input  onChange={this.handlestatus4} type="checkbox" />
                            <span className="checkmark"></span>
                        </label>
                        <label className="checkBoxcontainer">تمام شده
                            <input  onChange={this.handlestatus5} type="checkbox" />
                            <span className="checkmark"></span>
                        </label>
                        <label className="checkBoxcontainer">لغو شده
                            <input  onChange={this.handlestatus6} type="checkbox" />
                            <span className="checkmark"></span>
                        </label>
               
                     </FormGroup>
                </Col>
                <Col md="11">
                 <div className='titleMargin'>نوع سفر</div>
                    <FormGroup check>
                            <label className="checkBoxcontainer">اقتصادی
                                <input  onChange={this.handleType} type="checkbox" />
                                <span className="checkmark"></span>
                            </label>

                            <label className="checkBoxcontainer">بانوان
                                <input  onChange={this.handleType1} type="checkbox" />
                                <span className="checkmark"></span>
                            </label>

                            <label className="checkBoxcontainer">رزرو
                                <input  onChange={this.handleType2} type="checkbox" />
                                <span className="checkmark"></span>
                            </label>
                    </FormGroup>
                </Col>
                <Col md="11">
                    <div className='titleMargin'>وضعیت پرداخت </div>
                    <FormGroup check>
                            <label className="radiocontainer">نقدی
                                <input  onChange={this.handlePaymentType1} type="radio" name='raido'/>
                                <span className="checkmark"></span>
                            </label>

                            <label className="radiocontainer">آنلاین
                                <input  onChange={this.handlePaymentType2} type="radio"  name='raido'/>
                                <span className="checkmark"></span>
                            </label>

                           
                    </FormGroup>
                </Col>
            </Row>
            //</Form> 
        )
       
    }

}
export default twoFieldSearch;