import React, { Component } from "react";
import { Route, withRouter, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import db from "./helpers/localDB";
import "./App.css";

import AdminMenu from "./containers/admin/Menu";
import AgentMenu from "./containers/agent/Menu";
import SuperAgentMenu from "./containers/superAgentMenu";
import GuestMenu from "./containers/guestMenu";

import AgentdriversList from "./containers/agent/DriverList";
import AdmindriversList from "./containers/admin/DriversList";
import AgentDiscountList from "./containers/agent/DiscountList";
import AgentDiscountAdd from "./containers/agent/AddDiscount";
import AdminTripList from "./containers/admin/TripList";
import AgenttripList from "./containers/agent/TripList";
import AdminPassengerList from "./containers/admin/PassengerList";
import AgentPassengerList from "./containers/agent/PassengerList";
import CommentList from "./containers/commentList";
import AgentList from "./containers/agent/AgentList";
import Driver from "./containers/driver";
import Login from "./containers/login";
import Register from "./containers/register";
import ForgotPassword from "./containers/forgotPassword";
import MapList from "./containers/PriceRulesList";
import AdminShivehMap from "./containers/admin/AddInsidePriceRule";
import AgentShivehMap from "./containers/agent/AddInsidePriceRule";
import AgentTripRequst from './containers/agent/TripRequest/TripRequest'
import AddOutsidePriceRule from "./containers/agent/AddOutsidePriceRule";
import TripReservedList from "./containers/tripReservedList";
import AgentPanel from "./containers/agent/Panel";
import SuperAgentPanel from "./containers/superAgentPanel";
import AdminPanel from "./containers/admin/Panel";

import config from "./config";

import Authorization from "./HOC/authorization";
import io from "socket.io-client";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
library.add(faSpinner);

const SuperAgent = Authorization(["superAgent", "admin"]);
const Agent = Authorization(["agent", "admin"]);
const Admin = Authorization(["admin"]);
// const All = Authorization(['superAgent', 'agent', "admin"]);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: {
        status: false,
        message: ""
      }
    };

    if (db.get("token").value()) {
      //redirect if in main page
      if (this.props.history.location.pathname === "/") {
        switch (db.get("role").value()) {
          case "admin":
            this.props.history.push("/admin/home");

            break;
          case "agent":
            this.props.history.push("/agent/home");

            break;
          case "superAgent":
            this.props.history.push("/superagent/home");

            break;
          default:
            this.props.history.push("/agent/home");

            break;
        }
      }

      //Setup Socket
      let socket = io(config.app.BASE_SOCKET_URL, {
        query: {
          token: db.get("token").value(),
          role: "AGENT"
        },
        transports: ["websocket"]
      });

      socket.on("error", err => {
        console.log("socket error" + err);
      });

      socket.on("trip_reserved_request", data => {
        try {
          var audio = new Audio(
            config.app.BASE_SOCKET_URL + "/sounds/notif.mp3"
          );
          audio.play();
        } catch (e) {
          console.log(e);
        }

        this.setState({
          alert: {
            status: true,
            message: "درخواست حمل بار دارید"
          }
        });
      });
    } else {
      if (this.props.history.location.pathname === "/") {
        this.props.history.push("/panel");
      }
    }
  }

  login = () => {
    //re render component to load logged menu
    //window.location.reload();

    let socket = io(config.app.BASE_SOCKET_URL, {
      query: {
        token: db.get("token").value(),
        role: "AGENT"
      },
      transports: ["websocket"]
    });

    socket.on("error", err => {
      console.log("socket error" + err);
    });

    if (
      db.get("role").value() === "admin" ||
      db.get("role").value() === "superAgent"
    ) {
      socket.on("trip_reserved_request", data => {
        try {
          var audio = new Audio(
            config.app.BASE_SOCKET_URL + "/sounds/notif.mp3"
          );
          audio.play();
        } catch (e) {
          console.log(e);
        }

        this.setState({
          alert: {
            status: true,
            message: "درخواست حمل بار دارید"
          }
        });
      });
    }
  };

  handleAlertBtn = () => {
    // if (this.props.history.location.pathname !== "/superagent/trips/reserved") {
    //redirect to trip requested page
    switch (db.get("role").value()) {
      case "admin":
        this.props.history.push("/admin/trips/reserved");
        this.forceUpdate();

        break;
      case "agent":
        this.props.history.push("/agent/trips/reserved");
        this.forceUpdate();

        break;
      case "superAgent":
        this.props.history.push("/superagent/trips/reserved");
        this.forceUpdate();

        break;
      default:
        this.props.history.push("/agent/trips/reserved");
        this.forceUpdate();
        break;
    }
    this.setState({
      alert: {
        status: false,
        message: ""
      }
    });
  };

  render() {
    if (!db.get("token").value()) {
      return (
        <div>
          {/* <LoggedMenu /> */}
          <Route excat path="/panel" render={props => <GuestMenu />} />

          {/* <Route excat path="/panel/home" render={(props) => <Panel />} /> */}

          <Switch>
            <Route
              excat
              path="/panel/login"
              render={props => <Login login={this.login} />}
            />

            <Route
              excat
              path="/panel/password/forgot"
              render={props => <ForgotPassword login={this.login} />}
            />

            <Route
              excat
              path="/panel/register"
              render={props => <Register register={this.register} />}
            />

            <Redirect
              to={{
                pathname: "/panel/login"
              }}
            />
          </Switch>
        </div>
      );
    } else {
      return (
        <div>
          <Modal isOpen={this.state.alert.status} toggle={this.handleAlertBtn}>
            <ModalBody>{this.state.alert.message}</ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleAlertBtn}>
                باشه
              </Button>{" "}
            </ModalFooter>
          </Modal>

          <Switch>
            <Route excat path="/agent" component={Agent(AgentMenu)} />
            <Route
              excat
              path="/superagent"
              component={SuperAgent(SuperAgentMenu)}
            />
            <Route excat path="/admin" component={Admin(AdminMenu)} />
          </Switch>

          <Switch>
            <Route excat path="/agent/home" component={Agent(AgentPanel)} />
            <Route
              excat
              path="/superagent/home"
              component={SuperAgent(SuperAgentPanel)}
            />
            <Route excat path="/admin/home" component={Admin(AdminPanel)} />
          </Switch>

          <Route
            excat
            path="/agent/drivers"
            component={Agent(AgentdriversList)}
          />
          <Route
            excat
            path="/admin/drivers"
            component={Admin(AdmindriversList)}
          />

          <Route
            excat
            path="/agent/discounts/index"
            component={Agent(AgentDiscountList)}
          />
          <Route
            excat
            path="/agent/discounts/add"
            component={Agent(AgentDiscountAdd)}
          />

          <Route
            excat
            path="/agent/passengers"
            component={Agent(AgentPassengerList)}
          />
          <Route
            excat
            path="/admin/passengers"
            component={Admin(AdminPassengerList)}
          />
          <Route
            excat
            path="/agent/trips/comments"
            component={Agent(CommentList)}
          />
          <Route
            excat
            path="/admin/trips/comments"
            component={Admin(CommentList)}
          />
          <Route
            excat
            path="/agent/trips/index"
            component={Agent(AgenttripList)}
          />
          <Route
            excat
            path="/admin/trips/index"
            component={Admin(AdminTripList)}
          />

          <Route excat path="/admin/agents" component={Admin(AgentList)} />

          <Route excat path="/agent/driver/:id" component={Agent(Driver)} />
          <Route excat path="/admin/driver/:id" component={Admin(Driver)} />
          <Route
            excat
            path="/superagent/trips/reserved"
            component={SuperAgent(TripReservedList)}
          />
          <Route
            excat
            path="/admin/trips/reserved"
            component={Admin(TripReservedList)}
          />
          <Route
            excat
            path="/agent/trips/reserved"
            component={Agent(TripReservedList)}
          />
          <Route
            exact
            path="/agent/price/rules/add"
            component={Agent(AgentShivehMap)}
          />
          <Route
            exact
            path="/admin/price/rules/add"
            component={Admin(AdminShivehMap)}
          />
          <Route
            exact
            path="/agent/price/rules/toArea/add"
            component={Agent(AddOutsidePriceRule)}
          />
          <Route
            exact
            path="/agent/trips/request/"
            component={Agent(AgentTripRequst)}
          />

          <Route exact path="/agent/price/rules" component={Agent(MapList)} />
          <Route exact path="/admin/price/rules" component={Admin(MapList)} />
        </div>
      );
    }
  }
}

export default withRouter(
  connect(
    null,
    null
  )(App)
);
