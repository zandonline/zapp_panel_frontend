import React, { Component } from "react";
import { Link } from "react-router-dom";
import db from "../helpers/localDB";
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from "reactstrap";

class SuperAgentMenu extends Component {
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

        <Link className="navbar-brand" to="/superagent/home">
          پنل حمل بار
        </Link>

        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link className="nav-link" to="/superagent/trips/reserved">
                درخواست های سفر
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

export default SuperAgentMenu;
