import React, { Component } from "react";
import { Table, Row, Col } from "reactstrap";

class Mytable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page:1
        }
      }
render() {
   
    return (
      
        <Row>
          <Col>
            <div className="table-responsive">
              <Table className="mt-5">
                <thead>
                  <tr>
                    {
                  this.props.titles.map(title => {
                    return(
                      <th key={title.name} className="text-right">{title.name}</th>
                    )
                  })
                  }
                  
                  </tr>
                </thead>
                <tbody>
                  {this.props.comments.length > 0 ? (
                      
                    this.props.comments.map((comment,index) => {
                        return (
                        
                            <tr key={comment.id}>
                            {
                                
                                Object.values(comment).map(a=>{
                                    return (
                                       
                                        <td key={comment.id+a} className="text-right">{a}</td>
                                    )
                                    })
                            }
                        

                            </tr>
                        )
                    })
                  ) : (
                    <tr>
                      <td>
                        <p className="text-right">نظری وجود ندارد</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

       
          </Col>
        </Row>
      
    )}
}
export default Mytable;