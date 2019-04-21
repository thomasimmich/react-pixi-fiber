import * as React from 'react';
import { Text, render } from "react-pixi-fiber";
import Emittable from "./Emittable";
import Ticks from "./Ticks";
import { isNullOrUndefined } from 'util';

interface Props {
  emittables: Emittable[];
  amount: number,
  rate: Ticks,
  ticker: any;
}

export default class Producer extends React.Component<Props> {
  private _deltaTime: number = 0;

  static defaultProps: Props = {
    emittables: new Array<Emittable>(),
    amount: 10,
    rate: Ticks.second(),
    onEmit: undefined,
    ticker: null
  };

  // set ticker(value: any) {
  //   this.setState({ emittables: this.props.emittables, ticker: value });
    
  // }

  componentDidMount() {
    this.props.ticker.add(this.emit);
  }

  componentWillUnmount() {
    this.props.ticker.remove(this.emit);
  }

  emit = (time: number) => {
    this._deltaTime += time;
    if (Math.floor(this._deltaTime) % (this.props.rate.ticks * 100) == 0) {
      let emittables = this.props.emittables; 
      this.props.emittables.push(new Emittable());
      this.setState({emittables: emittables});
    }

  };

  render() {
    let propsText = this.props.emittables.length.toString();
    return <Text text={`${this.constructor.name}: ${propsText}`} />;
  }
}