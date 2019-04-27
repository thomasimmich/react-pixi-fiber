import React, { Fragment } from "react";
import { Text, Graphics } from "react-pixi-fiber";
import * as box2d from "@flyover/box2d";
import { PixiDebugDraw } from "../utils/PixiDebugDraw";
import { DebugSettings } from "../utils/DebugSettings";
import { Application } from "pixi.js";

interface Props {
    app?: Application
    debugSettings?: DebugSettings;
}

interface State {
    world: box2d.b2World;
    debugDraw?: PixiDebugDraw;
}

export default class World extends React.Component<Props, State> {
    static defaultProps: Props = {
        app: undefined,
        debugSettings: new DebugSettings()
    };

    private debugGraphics = React.createRef<Graphics>();

    constructor(props = World.defaultProps) {
        super(props);
        this.state = {
            world: new box2d.b2World(new box2d.b2Vec2(0, 9.8))
        }

        const bd = new box2d.b2BodyDef();
        const ground = this.state.world.CreateBody(bd);

        {
            const shape = new box2d.b2PolygonShape();
            const vertices = [
                new box2d.b2Vec2(-4, 0),
                new box2d.b2Vec2(4, 0),
                new box2d.b2Vec2(4, 1),
                new box2d.b2Vec2(-4, 1),
            ];
            shape.Set(vertices, 4);
            ground.CreateFixture(shape, 0.0);
        }

        {
            const shape = new box2d.b2PolygonShape();
            const vertices = [
                new box2d.b2Vec2(-4, 0.9),
                new box2d.b2Vec2(-2, 0.9),
                new box2d.b2Vec2(-2, 3),
                new box2d.b2Vec2(-4, 4),
            ];
            shape.Set(vertices, 4);
            ground.CreateFixture(shape, 0.0);
        }

        {
            const shape = new box2d.b2PolygonShape();
            const vertices = [
                new box2d.b2Vec2(2, 0.9),
                new box2d.b2Vec2(4, 0.9),
                new box2d.b2Vec2(4, 4),
                new box2d.b2Vec2(2, 3),
            ];
            shape.Set(vertices, 4);
            ground.CreateFixture(shape, 0.0);
        }
    }


    componentDidMount() {
        this.setupDebugDraw();
    }

    componentWillUnmount() {

    }

    setupDebugDraw() {
        let graphics = this.debugGraphics.current as any as PIXI.Graphics;

        let debugDraw = new PixiDebugDraw(this.props.app!, graphics);

        let flags = box2d.b2DrawFlags.e_none;
        let debugSettings = this.props.debugSettings;
        if (debugSettings === undefined) {
            debugSettings = new DebugSettings();
        }
        if (debugSettings.drawShapes) { flags |= box2d.b2DrawFlags.e_shapeBit; }
        // #if B2_ENABLE_PARTICLE
        if (debugSettings.drawParticles) { flags |= box2d.b2DrawFlags.e_particleBit; }
        // #endif
        if (debugSettings.drawJoints) { flags |= box2d.b2DrawFlags.e_jointBit; }
        if (debugSettings.drawAABBs) { flags |= box2d.b2DrawFlags.e_aabbBit; }
        if (debugSettings.drawCOMs) { flags |= box2d.b2DrawFlags.e_centerOfMassBit; }
        if (debugSettings.drawControllers) { flags |= box2d.b2DrawFlags.e_controllerBit; }
        debugDraw.SetFlags(flags);

        this.setState({ debugDraw: debugDraw });
        this.state.world.SetDebugDraw(debugDraw);
    }



    update() {

    }

    render() {
        this.state.world.DrawDebugData();
        return (
            <Fragment>
                <Graphics
                    ref={this.debugGraphics}
                    width={this.props.app!.screen.width}
                    height={this.props.app!.screen.height}/>
            </Fragment>);
    }
}
