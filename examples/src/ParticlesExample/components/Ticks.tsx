import * as React from 'react';
import { Text } from "react-pixi-fiber";

interface Props {
  ticks: number;
}

export default class Ticks extends React.Component<Props> {
  static defaultProps: Props = {
    ticks: 1
  };

  public static second() {
    return new Ticks({ticks: 1});
  }

  public static minute() {
    return new Ticks({ticks: 60});
  }

  render() {
    let propsText = this.props.ticks.toString();
    return <Text text={`${this.constructor.name}: ${propsText}`} />;
  }
}