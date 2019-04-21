import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withApp, ParticleContainer, Sprite, Text } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import Particle from "./Particle";
import Producer from "./Producer";
import bunnys from "../assets/particles.png";

import ACTIONS from "../../App/modules/actions";

const maxSize = 200000;
const gravity = 0.5;
const maxX = 800;
const maxY = 600;
const minX = 0;
const minY = 0;

const bunnyAnchor = new PIXI.Point(0.5, 1);
const particleContainerProperties = {
  scale: false,
  position: true,
  rotation: false,
  uvs: false,
  tint: false,
};

const generateParticle = texture => ({
  speedX: Math.random() * 10,
  speedY: Math.random() * 10 - 5,
  texture: texture,
});

const moveBunny = function() {
  this.x += this.speedX;
  this.y += this.speedY;
  this.speedY += gravity;

  if (this.x > maxX) {
    this.speedX *= -1;
    this.x = maxX;
  } else if (this.x < minX) {
    this.speedX *= -1;
    this.x = minX;
  }

  if (this.y > maxY) {
    this.speedY *= -0.85;
    this.y = maxY;
    if (Math.random() > 0.5) {
      this.speedY -= Math.random() * 6;
    }
  } else if (this.y < minY) {
    this.speedY = 0;
    this.y = minY;
  }
};

class JuiceParticleContainer extends Component {
  state = {
    particles: [],
    currentTexture: 0,
    isAdding: false,
  };

  componentDidMount() {
    const bunnyTextures = new PIXI.Texture.fromImage(bunnys);
    const bunny1 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 47, 26, 37));
    const bunny2 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 86, 26, 37));
    const bunny3 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 125, 26, 37));
    const bunny4 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 164, 26, 37));
    const bunny5 = new PIXI.Texture(bunnyTextures.baseTexture, new PIXI.Rectangle(2, 2, 26, 37));

    this.bunnyTextures = [bunny1, bunny2, bunny3, bunny4, bunny5];
    const currentTexture = 2;
    this.setState({
      particles: [generateParticle(currentTexture), generateParticle(currentTexture)],
      currentTexture: currentTexture,
    });

    this.props.app.ticker.add(this.animate);
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.animate);
  }

  createParticle = evt => {
    evt.preventDefault();
    const description = 'new particle';
    
    description && this.props.dispatch({ type: ACTIONS.Types.CREATE_PARTICLES, description });
  }

  animate = () => {
    const { particles, currentTexture } = this.state;


    const addedParticles = [];

    if (particles.length < maxSize) {
      for (let i = 0; i < this.producer.props.emittables.length; i++) {
        addedParticles.push(generateParticle(currentTexture));
      }
    }
    const newParticles = addedParticles;

    this.setState({ particles: newParticles });
    

    this.particleContainer.children.forEach(bunny => bunny.update(bunny));
  };

  handlePointerDown = () => {
    this.setState({ isAdding: true });
  };

  handlePointerUp = () => {
    this.setState(state => ({
      currentTexture: (state.currentTexture + 1) % 5,
    }));

    this.setState({ isAdding: false });
  };

  render() {
    const { particles: bunnys } = this.state;

    return (
      <Fragment>
        <Producer
          ref={c => (this.producer = c)}
          ticker={this.props.app.ticker}/>
        <ParticleContainer
          ref={c => (this.particleContainer = c)}
          maxSize={maxSize}
          properties={particleContainerProperties}
        >
          {bunnys.map((bunny, i) => (
            <Particle
              key={i}
              anchor={bunnyAnchor}
              update={moveBunny}
              speedX={bunny.speedX}
              speedY={bunny.speedY}
              texture={this.bunnyTextures[bunny.texture]}
            />
          ))}
        </ParticleContainer>
        <Text text={`${bunnys.length} BUNNIES`} style={{ fill: 0xffff00, fontSize: 14 }} x={5} y={5} />
        {/* ParticleContainer and its children cannot be interactive
            so here's a clickable hit area */}
        <Sprite
          height={600}
          interactive
          pointerdown={this.handlePointerDown}
          pointerup={this.handlePointerUp}
          texture={PIXI.Texture.EMPTY}
          width={800}
        />
      </Fragment>
    );
  }
}
JuiceParticleContainer.propTypes = {
  app: PropTypes.object,
};

// require('react-dom');
// window.React2 = require('react');
// console.log('REACT DOUBLES')
// console.log(window.React1 === window.React2);

export default withApp(JuiceParticleContainer);