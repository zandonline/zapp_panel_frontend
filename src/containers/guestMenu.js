import React ,{Component} from "react";
import { Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap';


class GuestMenu extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggle = (e) => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/"><Link className="navbar-brand" to="/panel/home">
          پنل نمایندگان زپ
          </Link></NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link className="nav-link" to="/panel/register">
                ثبت نام
                </Link>
              {/* <NavLink href="/components/">Components</NavLink> */}
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="/panel/login">
                ورود
                </Link>
              {/* <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink> */}
            </NavItem>

          </Nav>
        </Collapse>
      </Navbar>







    );
  }

}

export default GuestMenu;
