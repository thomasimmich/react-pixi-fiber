import React, { Fragment } from "react";
import { Text, Graphics } from "react-pixi-fiber";
import * as box2d from "@flyover/box2d";
import { PixiDebugDraw } from "../utils/PixiDebugDraw";
import { DebugSettings } from "../utils/DebugSettings";
import { RadialEmitter, EmittedParticleCallback } from "../utils/ParticleEmitter";
import { Application } from "pixi.js";

export class ParticleLifetimeRandomizer extends EmittedParticleCallback {
    public minLifetime = 0.0;
    public maxLifetime = 0.0;
    constructor(minLifetime: number, maxLifetime: number) {
        super();
        this.minLifetime = minLifetime;
        this.maxLifetime = maxLifetime;
    }
    /**
     * Called for each created particle.
     */
    public ParticleCreated(system: box2d.b2ParticleSystem, particleIndex: number): void {
        system.SetParticleLifetime(particleIndex, Math.random() * (this.maxLifetime - this.minLifetime) + this.minLifetime);
    }
}

interface Props {
    app?: Application
    physics: box2d.b2World;
    faucetLength: number;
    spoutLength: number;
    containerWidth: number;
    containerHeight: number;
    spoutWidth: number;
    faucetWidth: number;
    faucetHeight: number;
    debugSettings?: DebugSettings;
}

interface State {
    particleSystem: box2d.b2ParticleSystem;
    emitter: RadialEmitter;
    debugDraw?: PixiDebugDraw;
}

export default class Cloud extends React.Component<Props, State> {
    static defaultProps: Props = {
        app: undefined,
        physics: new box2d.b2World(new box2d.b2Vec2(0, 1)),
        faucetLength: 10,
        faucetWidth: 10,
        faucetHeight: 20,
        spoutLength: 2,
        spoutWidth: 4,
        containerWidth: 20,
        containerHeight: 40,
        debugSettings: new DebugSettings()
    };

    private debugGraphics = React.createRef<Graphics>();

    constructor(props = Cloud.defaultProps) {
        super(props);
    }

    componentDidMount() {
  
        this.state = {
            particleSystem: this.props.physics.CreateParticleSystem(new box2d.b2ParticleSystemDef()),
            emitter: new RadialEmitter()
        }

        let ground: box2d.b2Body;
        {
            const bd = new box2d.b2BodyDef();
            ground = this.props.physics!.CreateBody(bd);
        }

        // Create the faucet spout.
        {
            const shape = new box2d.b2PolygonShape();
            const particleDiameter =
                this.state.particleSystem.GetRadius() * 2.0;
            const faucetLength = this.props.faucetLength * particleDiameter;
            // Dimensions of the faucet in world units.
            const length = faucetLength * this.props.spoutLength;
            const width = this.props.containerWidth * this.props.faucetWidth *
                this.props.spoutWidth;
            // Height from the bottom of the container.
            const height = (this.props.containerHeight * this.props.faucetHeight) +
                (length * 0.5);

            shape.SetAsBox(particleDiameter, length,
                new box2d.b2Vec2(-width, height), 0.0);
            ground.CreateFixture(shape, 0.0);
            shape.SetAsBox(particleDiameter, length,
                new box2d.b2Vec2(width, height), 0.0);
            ground.CreateFixture(shape, 0.0);
            shape.SetAsBox(width - particleDiameter, particleDiameter,
                new box2d.b2Vec2(0.0, height + length -
                    particleDiameter), 0.0);
            ground.CreateFixture(shape, 0.0);
        }

        // Initialize the particle emitter.
        {
            const faucetLength = this.state.particleSystem.GetRadius() * 2.0 * this.props.faucetLength;
            this.state.emitter.SetParticleSystem(this.state.particleSystem);
            //this.m_emitter.SetCallback(this.m_lifetimeRandomizer);
            this.state.emitter.SetPosition(new box2d.b2Vec2(
                this.props.containerWidth * this.props.faucetWidth,
                this.props.containerHeight * this.props.faucetHeight + (faucetLength * 0.5)));
            this.state.emitter.SetVelocity(new box2d.b2Vec2(0.0, 0.0));
            this.state.emitter.SetSize(new box2d.b2Vec2(0.0, faucetLength));
            this.state.emitter.SetColor(new box2d.b2Color(1, 1, 1, 1));
            this.state.emitter.SetEmitRate(120.0);
            this.state.emitter.SetParticleFlags(box2d.b2ParticleFlag.b2_waterParticle);
        }

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
        this.props.physics!.SetDebugDraw(debugDraw);
    }



    update() {

    }

    render() {
        //this.props.world!.DrawDebugData();
        return (
            <Fragment>
                <Graphics
                    ref={this.debugGraphics}
                    width={this.props.app!.screen.width}
                    height={this.props.app!.screen.height} />
            </Fragment>);
    }
}
