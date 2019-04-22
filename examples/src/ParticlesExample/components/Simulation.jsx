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
        world: new b2.World(
            new b2.Vec2(0, 9.8) // Gravity Vector
        ),
        width: 1000,
        height: 1000,
    }

    componentDidMount() {
        let liquidContainerDef = new b2.BodyDef();
        let liquidContainer = this.props.world.CreateBody(liquidContainerDef);

        let floor = this.createWallShape(
            this.props.width / Simulation.METER / 2,
            0.05,
            new b2.Vec2(this.props.width / Simulation.METER / 2, this.props.height / Simulation.METER + 0.05)
        )

        let leftWall = this.createWallShape(
            0.05,
            this.props.height / Simulation.METER / 2,
            new b2.Vec2(-0.05, this.props.height / Simulation.METER / 2)
        )

        let rightWall = this.createWallShape(
            0.05,
            this.props.height / Simulation.METER / 2,
            new b2.Vec2(this.props.width / Simulation.METER + 0.05, this.props.height / Simulation.METER / 2)
        )

        liquidContainer.CreateFixture(floor);
        liquidContainer.CreateFixture(leftWall);
        liquidContainer.CreateFixture(rightWall);

        let particleSystemDef = new b2.ParticleSystemDef();
        particleSystemDef.radius = 0.03;
        particleSystemDef.dampingStrength = 0.2;

        this.particleSystem = this.props.world.CreateParticleSystem(particleSystemDef);

        this.particleShape = new b2.CircleShape();
    }

    createWallShape(width, height, angle) {
        let wallShape = new b2.PolygonShape();
        wallShape.SetAsBox(width, height, angle, 0);
        //p2.SetAsBox(0.05, 1, new b2.Vec2(-2, 0), 0);

        let fixtureDef = new b2.FixtureDef();
        fixtureDef.shape = wallShape;
        fixtureDef.density = 5;

        return fixtureDef;
    }

    componentWillUnmount() {
    }

    render() {
        let propsText = 'gravity: '+this.props.world.GetGravity().y.toString();
        return <Text text={`${this.constructor.name}: ${propsText}`} />;
    }
}


Simulation.propTypes = {
    world: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    particleSystem: PropTypes.object,
    particle: PropTypes.object
};


export default Simulation;