import React, { Component } from "react";
import { Link } from "react-router-dom";
import db from "../../helpers/localDB";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggle = e => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    return (
      <Navbar className="navbar navbar-expand-md navbar-dark bg-primary">
       {/* <div className="snowflakes" aria-hidden="true">
          <div className="snowflake">❀</div>
          <div className="snowflake">✿</div>
          <div className="snowflake">❀</div>
          <div className="snowflake">✿</div>
          <div className="snowflake">❀</div>
          <div className="snowflake">✿</div>
          <div className="snowflake">❀</div>
          <div className="snowflake">✿</div>
          <div className="snowflake">❀</div>
          <div className="snowflake">✿</div>
          <div className="snowflake">❀</div>
          <div className="snowflake">✿</div>
        </div> */}

        <Link className="navbar-brand" to="/admin/home">
          پنل مدیریت
        </Link>

        {/* <p style={{color:"#9CF49C","margin-right": "8px"}}>نوروزتان پیروز</p> */}


        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link className="nav-link" to="/admin/agents">
                نمایندگان
              </Link>
              {/* <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink> */}
            </NavItem>

            <NavItem>
              <Link className="nav-link" to="/admin/drivers">
                رانندگان
              </Link>
              {/* <NavLink href="/components/">Components</NavLink> */}
            </NavItem>

            <NavItem>
              <Link className="nav-link" to="/admin/passengers">
                مسافران
              </Link>
              {/* <NavLink href="/components/">Components</NavLink> */}
            </NavItem>

            <NavItem>
              <Link className="nav-link" to="/admin/trips/index">
                سفر ها
              </Link>
              {/* <NavLink href="/components/">Components</NavLink> */}
            </NavItem>

            <NavItem>
              <Link className="nav-link" to="/admin/price/rules">
                قیمت گذاری
              </Link>
              {/* <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink> */}
            </NavItem>

            <NavItem>
              <Link className="nav-link" to="/admin/trips/reserved">
                درخواست های حمل بار
              </Link>
              {/* <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink> */}
            </NavItem>

            <NavItem>
              <Link className="nav-link" to="/admin/trips/comments">
                نظرات مسافران
              </Link>
              {/* <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink> */}
            </NavItem>

            <NavItem>
              <form className="form-inline">
                <button
                  className="nav-link btn btn-danger p-2"
                  href="/panel/login"
                  type="button"
                  onClick={() => {
                    db.set("token", "").write();
                    db.set("role", "").write();
                    this.props.history.push("/panel/login");
                    window.location.reload();
                  }}
                >
                  خروج
                </button>
              </form>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default Menu;
