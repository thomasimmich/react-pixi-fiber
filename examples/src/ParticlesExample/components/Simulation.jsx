import React, { Component } from "react";
import { Text } from "react-pixi-fiber";
import PropTypes from "prop-types";
import b2 from "lucy-b2";

class Simulation extends Component {
    static METER = 100;
    static OFFSET_X = 0;
    static OFFSET_Y = 0;
    static PADDING = 50;

    static defaultProps = {
        gravity: new b2.Vec2(0, 10),
        //world: new b2.World(Simulation.gravity),
        //width: 1000,
        //height: 1000,
    }

    props = Simulation.defaultProps;

    componentDidMount() {
 
    }

    componentWillUnmount() {
    }

    render() {
        let propsText = this.props.gravity.toString();
        return <Text text={`${this.constructor.name}: ${propsText}`} />;
    }
}


Simulation.propTypes = {
    gravity: PropTypes.object,
    world: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    particleSystem: PropTypes.object,
    particle: PropTypes.object
};


export default Simulation;