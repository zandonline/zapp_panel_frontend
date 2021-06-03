import React, { Component } from "react";
import { Button, Row, Col,FormGroup,Input } from "reactstrap";


class search extends Component {
    state={
        query:''
    }
    handleLangChange = (e) => {
     
        this.setState({query: e.target.value});

    }
    passData=()=>{
        this.props.onSelectLanguage(this.state.query); 
    }
    render(){
        return(
            // <Form>

            <Row  className='mrginTop'>
                <Col md='6'>
                <FormGroup>
                <label>{this.props.title}</label>
                <Input type="text" value={this.state.query}  placeholder="جستجو"  onChange={this.handleLangChange}/>
                </FormGroup>
                
                </Col>
                <Col  md='1'>
                <Button color='info' className="mrginTop" onClick={this.passData}>جستجو

                </Button>
                </Col>
            </Row>
            //</Form> 
        )
       
    }

}
export default search;