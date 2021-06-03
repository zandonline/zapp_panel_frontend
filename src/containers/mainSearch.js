import React, { Component } from "react";
import { Button, Row, Col,FormGroup,Input } from "reactstrap";

function toggleCheckbox(index) {
    const {checkboxes} = this.state;

    checkboxes[index].checked = !checkboxes[index].checked;

    this.setState({
        checkboxes
    });

}
//var checkedStatus=[];
class search extends Component {
    state={ 
        fieldData:[],
        checkboxes:[]
      
    }
    handleLangChange = (index,e) => {
        const {fieldData} = this.state;
       
       
        fieldData[index]=e.target.value;
        this.setState({
            fieldData
        })
      
    }
    passData=()=>{
        let checkedStatus=[];
      
        
        for(var i=0;i<this.state.checkboxes.length;i++){
                if(this.state.checkboxes[i].checked){
                    checkedStatus.push(this.state.checkboxes[i].value);
                }
        }
        this.props.onSelectLanguage(this.state.fieldData,checkedStatus); 
    }

    componentDidMount(){
        this.setState({
            checkboxes:this.props.checkboxes
        })
    }
    
    render(){
        return(
            // <Form>
            <Row  className='mrginTop'>
               
                {
                    this.props.fiedls.map((field,index) =>{
                        return(
                            <Col md='5' key={index}>
                            <FormGroup >
                            <label>{field.name}</label>
                            
                            <Input type="text"  placeholder="جستجو"  onChange={this.handleLangChange.bind(this,index)}/>
                            </FormGroup>
                            </Col>
                        )
                    })
                }

             
                
               
                <Col  md='1'>
                <Button color='info' className="mrginTop" onClick={this.passData}>جستجو
               
                </Button>
                </Col>
                <Col md='11'>
                <FormGroup check>              
                    {
                        this.state.checkboxes.map((checkbox, index) =>{
                        return(
                            
                                <label key={index} className="checkBoxcontainer">
                                {checkbox.label}
                                    <input
                                        type="checkbox"
                                        checked={checkbox.checked}
                                        onChange={toggleCheckbox.bind(this, index)}
                                    />
                                   
                                    <span className="checkmark"></span>
                                </label>

                        )}
                        )

                    }
                    </FormGroup>
                </Col>
            </Row>
            
        )
       
    }

}
export default search;