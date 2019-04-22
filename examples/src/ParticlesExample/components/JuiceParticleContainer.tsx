import React, { Component, Fragment, createRef } from "react";
import PropTypes, { any } from "prop-types";
import { ParticleContainer, Sprite, Text, AppContext } from "react-pixi-fiber";
import "react-pixi-fiber";
import * as PIXI from "pixi.js";
import Particle from "./Particle";
import Producer from "./Producer";
import Simulation from "./Simulation";
import particlesSpriteSheet from "../assets/particles.png";


const maxSize = 200000;
const gravity = 0.5;
const maxX = 800;
const maxY = 600;
const minX = 0;
const minY = 0;

const particleContainerProperties = {
  scale: false,
  position: true,
  rotation: false,
  uvs: false,
  tint: false,
};


// const generateParticleLegacy = texture => ({
//   speedX: Math.random() * 10,
//   speedY: Math.random() * 10 - 5,
//   texture: texture,
// });

const moveBunnny = function (particle: any): void {
  particle.x += particle.speedX;
  particle.y += particle.speedY;
  particle.speedY += gravity;

  if (particle.x > maxX) {
    particle.speedX *= -1;
    particle.x = maxX;
  } else if (particle.x < minX) {
    particle.speedX *= -1;
    particle.x = minX;
  }

  if (particle.y > maxY) {
    particle.speedY *= -0.85;
    particle.y = maxY;
    if (Math.random() > 0.5) {
      particle.speedY -= Math.random() * 6;
    }
  } else if (particle.y < minY) {
    particle.speedY = 0;
    particle.y = minY;
  }
};

class ParticleInfo {
  textureIndex = 0;
  x = 0;
  y = 0;
  speedX = 0;
  speedY = 0;

  static update(particle: ParticleInfo) {
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    particle.speedY += gravity;

    if (particle.x > maxX) {
      particle.speedX *= -1;
      particle.x = maxX;
    } else if (particle.x < minX) {
      particle.speedX *= -1;
      particle.x = minX;
    }

    if (particle.y > maxY) {
      particle.speedY *= -0.85;
      particle.y = maxY;
      if (Math.random() > 0.5) {
        particle.speedY -= Math.random() * 6;
      }
    } else if (particle.y < minY) {
      particle.speedY = 0;
      particle.y = minY;
    }
  }
}

interface Props {
  app: any
}

interface State {
  particleInfos: ParticleInfo[];
  particleTextures: PIXI.Texture[];
  currentTextureIndex: number;
}

class JuiceParticleContainer extends React.Component<Props, State> {
  static defaultProps: Props = {
    app: null
  };

  constructor(props = JuiceParticleContainer.defaultProps) {
    super(props);
    this.state = {
      particleInfos: [],
      particleTextures: [],
      currentTextureIndex: 0
    }
  }

  private simulation = React.createRef<Simulation>();
  private producer = React.createRef<Producer>();
  private particleContainer = React.createRef<ParticleContainer>();

  componentDidMount() {
    const bunnyTexturesMap = PIXI.Texture.fromImage(particlesSpriteSheet);
    const tex1 = new PIXI.Texture(bunnyTexturesMap.baseTexture, new PIXI.Rectangle(2, 47, 26, 37));
    const tex2 = new PIXI.Texture(bunnyTexturesMap.baseTexture, new PIXI.Rectangle(2, 86, 26, 37));
    const tex3 = new PIXI.Texture(bunnyTexturesMap.baseTexture, new PIXI.Rectangle(2, 125, 26, 37));
    const tex4 = new PIXI.Texture(bunnyTexturesMap.baseTexture, new PIXI.Rectangle(2, 164, 26, 37));
    const tex5 = new PIXI.Texture(bunnyTexturesMap.baseTexture, new PIXI.Rectangle(2, 2, 26, 37));

    const currentTextureIndex = 2;
    this.setState({
      particleInfos: [this.createParticleInfo(currentTextureIndex), this.createParticleInfo(currentTextureIndex)],
      particleTextures: [tex1, tex2, tex3, tex4, tex5],
      currentTextureIndex: currentTextureIndex,
    });


    this.props.app.ticker.add(this.animate);
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.animate);
  }

  createParticleInfo = (textureIndex: number) => {
    let particleInfo = new ParticleInfo();
    particleInfo.textureIndex = textureIndex;
    particleInfo.speedX = Math.random() * 10;
    particleInfo.speedY = Math.random() * 10 - 5;

    this.simulation.current!.createParticle(particleInfo);

    return particleInfo;
  }

  animate = () => {
    const { particleInfos, currentTextureIndex } = this.state;
    const addedParticleInfos = [];
    const producer = this.producer.current!;

    if (particleInfos.length < maxSize) {
      for (let i = 0; i < producer.state.emittables.length; i++) {
        addedParticleInfos.push(this.createParticleInfo(currentTextureIndex));
      }
    }

    addedParticleInfos.forEach(particleInfo => ParticleInfo.update(particleInfo));

    this.setState({ particleInfos: addedParticleInfos });
  };

  handlePointerDown = () => {
    //this.setState({ isAdding: true });
  };

  handlePointerUp = () => {
    this.setState({
      currentTextureIndex: (this.state.currentTextureIndex + 1) % 5,
    });

    //this.setState({ isAdding: false });
  };

  render() {
    return (
      <Fragment>

        <Simulation
          ref={this.simulation}
          {...Simulation.defaultProps}
          ticker={this.props.app.ticker}
        />

        <Producer
          ref={this.producer}
          {...Producer.defaultProps}
          ticker={this.props.app.ticker}
        />

        <ParticleContainer
          ref={this.particleContainer}
          //properties={particleContainerProperties}
          texture={this.state.particleTextures[0]}
        >
          {this.state.particleInfos.map((particleInfo, i) => (
            <Particle
              key={i}
              anchor={new PIXI.Point(0.5, 1)}
              update={ParticleInfo.update}
              speedX={particleInfo.speedX}
              speedY={particleInfo.speedY}
              texture={this.state.particleTextures[particleInfo.textureIndex]}
            />
          ))}
        </ParticleContainer>
        <Text text={`${this.state.particleInfos.length} BUNNIES`} x={5} y={5} />
        {/* ParticleContainer and its children cannot be interactive
            so here's a clickable hit area */}
        <Sprite
          height={600}
          interactive
          //pointerdown={this.handlePointerDown}
          //pointerup={this.handlePointerUp}
          texture={PIXI.Texture.EMPTY}
          width={800}
        />

      </Fragment>
    );
  }
}

// require('react-dom');
// window.React2 = require('react');
// console.log('REACT DOUBLES')
// console.log(window.React1);
// console.log(window.React1 === window.React2);


export default function withApp(props: Props) {
  return <AppContext.Consumer>{app => <JuiceParticleContainer {...props} app={app} />}</AppContext.Consumer>;
}
