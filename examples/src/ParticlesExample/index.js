import React, { Component } from "react";
import { Stage } from "react-pixi-fiber";
import JuiceParticleContainer from "./components/JuiceParticleContainer";



const OPTIONS = {
  backgroundColor: 0x1099bb,
};

class ParticlesExample extends Component {
  render() {
    return (
      <Stage width={800} height={600} options={OPTIONS}>
        <JuiceParticleContainer/>
      </Stage>
    );
  }
}

export default ParticlesExample;
