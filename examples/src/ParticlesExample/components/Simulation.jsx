import { Component } from "react";
import PropTypes from "prop-types";
import { b2Vec2, b2World } from "liquidfun-emscripten";

class Simulation extends Component {
    static defaultProps = {
        gravity: new b2Vec2(0, 10),
        world: new b2World(Simulation.gravity)
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
    }
}


Simulation.propTypes = {
    gravity: PropTypes.object,
    world: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    particleSystem: PropTypes.object,
    particle: PropTypes.object,
};


export default Simulation;