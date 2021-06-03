import React, { Component } from "react";
import axios from "axios";
import config from "../config";
import db from "../helpers/localDB";
import {Container,Row} from "reactstrap";
import MyTable from './table';
import Search from './mainSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      titles:[
      {'name':'###'}
      , {'name':'نام و نام خانوادگی'}
      ,{'name':'شماره همراه'}
      ,{'name':'پیام'}
      ,{'name':'امتیاز'}
      ,{'name':'نام راننده'}
      ,{'name':'کد سفر'}
    ],
      page: 1,
      searchData:'',
      showLoader:false,
      fiedls:[
        {'name':'نام مسافر'},
     
    ],
    };

    this.loadComments();
  }

  async loadComments(page = 1,searchData=[]) {
    this.state.showLoader=true;
    try {
      let result = await axios({
        url: config.app.BASE_URL + "panel/index/trips/comments?page=" + page,
        method: "post",
        headers: {
          Authorization: `Bearer ${db.get("token").value()}`,
          "Content-Type": "application/json"
        },
        data:{
          "search":{"passengerName":searchData[0]},

     
        },
      });
      this.state.showLoader=false;
      if (result.data.status === 200) {
        if (result.data.comments.length === 0) {
          this.setState({
            comments: []
          });
        } else {
          this.setState({
            comments: result.data.comments
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

    if (currentPage >= 1 && this.state.comments.length > 0) {
      this.setState({
        page: currentPage
      });

      this.loadComments(currentPage);
    }
  };

  handlePrevBtn = e => {
    e.preventDefault();
    let currentPage = this.state.page - 1;

    if (currentPage >= 1) {
      this.setState({
        page: currentPage
      });

      this.loadComments(currentPage);
    }
  };
  
  handleSearch = (searchData) => { 
    //console.log(searchData);
    this.setState({
      searchData : searchData,
      page:1
    });
    this.loadComments(1,searchData);
  };

  render() {
    return (
      <Container>
            <Search fiedls={this.state.fiedls} checkboxes={[]} onSelectLanguage={this.handleSearch}></Search>

         {/* <Search onSelectLanguage={this.handleSearch} title='نام مسافر'></Search> */}
         <Row className="centerize height1">
         {
           this.state.showLoader?
            <FontAwesomeIcon icon="spinner" className="Loader" /> 
            :
            ''
          }
          </Row>
      <MyTable titles={this.state.titles} comments={ this.state.comments}></MyTable>
      
             <div className="m-auto d-block mt-3">
              <button
                id="nextBtn"
                className={
                  this.state.page + 1 >= 1 && this.state.comments.length > 0
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
     
      </Container>
     
      // <Container>
      //   <Row>
      //     <Col>
      //       <div className="table-responsive">
      //         <Table className="mt-5">
      //           <thead>
      //             <tr>
      //               {
      //             this.state.titles.map(title => {
      //               return(
      //                 <th className="text-right">{title.name}</th>
      //               )
      //             })
      //             }
                  
      //             </tr>
      //           </thead>
      //           <tbody>
      //             {this.state.comments.length > 0 ? (
      //               this.state.comments.map(comment => {
      //                 return (
      //                   <tr key={comment.id}>
      //                     {/* <th scope="row">###</th> */}
      //                     <td className="text-right">
      //                       {comment.passengerFullName}
      //                     </td>
      //                     <td className="text-right">
      //                       {comment.passengerPhoneNumber}
      //                     </td>
      //                     <td className="text-right">{comment.comment}</td>
      //                     <td className="text-right">{comment.score}</td>
      //                     <td className="text-right">{comment.tripCode}</td>
      //                   </tr>
      //                 );
      //               })
      //             ) : (
      //               <tr>
      //                 <td>
      //                   <p className="text-right">نظری وجود ندارد</p>
      //                 </td>
      //               </tr>
      //             )}
      //           </tbody>
      //         </Table>
      //       </div>

      //       <div className="m-auto d-block mt-3">
      //         <button
      //           id="nextBtn"
      //           className={
      //             this.state.page + 1 >= 1 && this.state.comments.length > 0
      //               ? "m-2 btn btn-primary"
      //               : "d-none"
      //           }
      //           onClick={this.handleNextBtn}
      //         >
      //           صفحه بعد
      //         </button>
      //         <button
      //           id="prevBtn"
      //           className={
      //             this.state.page - 1 >= 1 ? "m-2 btn btn-primary" : "d-none"
      //           }
      //           onClick={this.handlePrevBtn}
      //         >
      //           صفحه قبل
      //         </button>
      //       </div>
      //     </Col>
      //   </Row>
      // </Container>
    );
  }
}

export default CommentList;
