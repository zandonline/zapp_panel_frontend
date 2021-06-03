import React, { Component } from "react";
import { Link } from "react-router-dom";
import db from "../helpers/localDB";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";

class AgentMenu extends Component {
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
        <div class="snowflakes" aria-hidden="true">
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
        </div>

        <Link className="navbar-brand" to="/agent/home">
          پنل نمایندگان زپ
        </Link>

        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link className="nav-link" to="/agent/drivers">
                رانندگان
              </Link>
              {/* <NavLink href="/components/">Components</NavLink> */}
            </NavItem>

            <NavItem>
              <Link className="nav-link" to="/agent/passengers">
                مسافران
              </Link>
              {/* <NavLink href="/components/">Components</NavLink> */}
            </NavItem>

            <NavItem>
              <Link className="nav-link" to="/agent/trips/index">
                سفر ها
              </Link>
              {/* <NavLink href="/components/">Components</NavLink> */}
            </NavItem>

            <NavItem>
              <Link className="nav-link" to="/agent/price/rules">
                قیمت گذاری
              </Link>
              {/* <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink> */}
            </NavItem>

            <NavItem>
              <Link className="nav-link" to="/agent/trips/comments">
                نظرات مسافران
              </Link>
              {/* <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink> */}
            </NavItem>

            <NavItem>
              <Link className="nav-link" to="/agent/trips/reserved">
                درخواست های حمل بار
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

export default AgentMenu;
