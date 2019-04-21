import * as React from 'react';
import { Text } from "react-pixi-fiber";

interface Props {
  name: string;
}

export default class Emittable extends React.Component<Props> {
  static defaultProps: Props = {
    name: 'Emittable'
  };
  
  
  constructor() {
    super(Emittable.defaultProps);
  }

  render() {
    let propsText = this.props.name.toString();
    return <Text text={propsText} />;
  }
}