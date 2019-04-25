import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import { Point } from "pixi.js";
import JuiceParticleContainer from "./components/JuiceParticleContainer";



const OPTIONS = {
  backgroundColor: 0x1099bb
};

const centerAnchor = new Point(0.5, 0.5);

class ParticlesExample extends Component {
  render() {
    return (
      <Stage options={OPTIONS}>
        <JuiceParticleContainer anchor={centerAnchor}/>
      </Stage>
    );
  }
}

export default ParticlesExample;
