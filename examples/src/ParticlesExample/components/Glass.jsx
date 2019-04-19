import React, { Component } from "react";
import PropTypes from "prop-types";
import { Sprite } from "react-pixi-fiber";
import { withApp } from "react-pixi-fiber";
import * as PIXI from "pixi.js";

class Glass extends Component {
  state = {
    rotation: 0,
  };

  componentDidMount() {
    this.props.app.ticker.add(this.animate);
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.animate);
  }

  animate = delta => {
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent tranformation
    this.setState(state => ({
      ...state,
      rotation: state.rotation + this.props.step * delta,
    }));
  };

  render() {
    const { step, ...props } = this.props;
    return <Sprite 
      //rotation={this.state.rotation}
      texture={PIXI.Texture.fromImage('https://s3-us-west-2.amazonaws.com/s.cdpn.io/557388/glass.png')}
      {...props} />
  }
}

Glass.propTypes = {
  app: PropTypes.object.isRequired,
  step: PropTypes.number
};

Glass.defaultProps = {
  step: 0.1,

};

export default withApp(Glass);
