import React, { Component } from "react";
import { Container, Stage } from "react-pixi-fiber";
import Glass from "./components/Glass";


const OPTIONS = {
  backgroundColor: 0x1099bb,
};

class ParticlesExample extends Component {
  render() {
    return (
      <Stage width={800} height={600} options={OPTIONS}>
        <Glass/>
      </Stage>
    );
  }
}

export default ParticlesExample;
