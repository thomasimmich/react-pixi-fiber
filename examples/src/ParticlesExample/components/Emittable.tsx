import * as React from 'react';
import { Text } from "react-pixi-fiber";
import Ticks from "./Ticks";

interface Props {
  amount: number;
  rate: Ticks;
}

export default class Emittable extends React.Component<Props> {
  static defaultProps: Props = {
    amount: 10,
    rate: Ticks.second()
  };
  
  constructor() {
    super(Emittable.defaultProps);
  }

  render() {
    let propsText = this.props.amount.toString()+' per '+this.props.rate;
    return <Text text={propsText} />;
  }
}