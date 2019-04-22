import * as React from 'react';
import { Text } from "react-pixi-fiber";
import Emittable from "./Emittable";
import Ticks from "./Ticks";

interface Props {
  name?: String;
  amount: number,
  rate: Ticks,
  ticker: any;
}

interface State {
  emittables: Emittable[];
}

export default class Producer extends React.Component<Props, State> {
  private _deltaTime: number = 0;

  static defaultProps: Props = {
    name: 'Producer',
    amount: 10,
    rate: Ticks.second(),
    ticker: null
  };

  // set ticker(value: any) {
  //   this.setState({ emittables: this.props.emittables, ticker: value });
    
  // }

  constructor(props = Producer.defaultProps) {
    super(props);
    this.state = { emittables: [] };
  }

  componentDidMount() {
    this.props.ticker.add(this.emit);
  }

  componentWillUnmount() {
    this.props.ticker.remove(this.emit);
  }

  emit = (time: number) => {
    this._deltaTime += time;
    if (Math.floor(this._deltaTime) % (this.props.rate.ticks * 100) == 0) {
      let newEmittables: Emittable[] = [];
      newEmittables = newEmittables.concat(this.state.emittables, new Emittable());
      this.setState({emittables: newEmittables});
    }
  };

  render() {
    let name = this.props.name ? this.props.name : this.constructor.name;
    let displayText = this.state.emittables.length.toString();
    return <Text text={`${name}: ${displayText}`} />;
  }
}