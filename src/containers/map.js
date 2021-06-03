import React, { Component } from "react";
import L from "leaflet";
import PropTypes from "prop-types";

class map extends Component {
  componentDidMount() {
    this.map = L.map(this.props.id, {
      center: this.props.mapPosition,
      zoom: this.props.mapZoom
    });

    // add the OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(this.map);

    L.polygon(this.props.points, { color: "red" }).addTo(this.map);

    if (this.props.markerPosition !== undefined) {
      L.marker(this.props.markerPosition).addTo(this.map);
    }
  }

  render() {
    return (
      //    <div className="bg-dark"></div>
      <div className="individualMap ltr" id={this.props.id} />
    );
  }
}

map.propTypes = {
  mapPosition: PropTypes.arrayOf(PropTypes.number),
  mapZoom: PropTypes.number,
  markerPosition: PropTypes.arrayOf(PropTypes.number)
};

map.defaultProps = {
  mapPosition: [35.7, 51.4],
  mapZoom: 9
};

export default map;
