import React, { Component } from "react";
import logo from "../logo.svg";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import ExampleList from "../ExampleList";
import AnimatedExample from "../AnimatedExample";
import ApplicationOptionsExample from "../ApplicationOptionsExample";
import BunnyExample from "../BunnyExample";
import BunnymarkExample from "../BunnymarkExample";
import CanvasPropsExample from "../CanvasPropsExample";
import ClickExample from "../ClickExample";
import CustomBunnymarkExample from "../CustomBunnymarkExample";
import CustomPIXIComponentExample from "../CustomPIXIComponentExample";
import LayersExample from "../LayersExample";
import PointsExample from "../PointsExample/PointsExample";
import BatchedUpdatesExample from "../BatchedUpdatesExample";
import ParticlesExample from "../ParticlesExample";
import Stats from "../Stats";

const examples = [
  {
    name: "Animated",
    slug: "animated",
    component: AnimatedExample,
  },
  {
    name: "Application Options",
    slug: "applicationoptions",
    component: ApplicationOptionsExample,
  },
  {
    name: "Bunny",
    slug: "bunny",
    component: BunnyExample,
  },
  {
    name: "Bunnymark",
    slug: "bunnymark",
    component: BunnymarkExample,
  },
  {
    name: "Bunnymark (using custom components)",
    slug: "custombunnymark",
    component: CustomBunnymarkExample,
  },
  {
    name: "Canvas Props",
    slug: "canvasprops",
    component: CanvasPropsExample,
  },
  {
    name: "Click",
    slug: "click",
    component: ClickExample,
  },
  {
    name: "CustomPIXIComponent",
    slug: "custompixicomponent",
    component: CustomPIXIComponentExample,
  },
  {
    name: "Layers",
    slug: "layers",
    component: LayersExample,
  },
  {
    name: "Point-like props",
    slug: "points",
    component: PointsExample,
  },
  {
    name: "unstable_batchedUpdates",
    slug: "unstable_batchedUpdates",
    component: BatchedUpdatesExample,
  },
  {
    name: "Particles ",
    slug: "particles",
    component: ParticlesExample,
  }
];

class App extends Component {
  render() {
    return (
      <div>
        <Stats />
        <div>
          <Switch>
            <Route exact path="/" render={props => <ExampleList {...props} examples={examples} />} />
            {examples.map(example => (
              <Route key={example.slug} exact path={`/${example.slug}`} component={example.component} />
            ))}
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
