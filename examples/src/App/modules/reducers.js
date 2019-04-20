import ACTIONS from "./actions";
import _ from "lodash";

const defaultState = {
  particles: []
};

const particleReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ACTIONS.Types.CREATE_PARTICLES: {
      console.log(action);

      let newParticle = { id: state.particles.length + 1, description: action.payload };
      let newState = _.cloneDeep(state);
      newState.particles.push(newParticle);
      return newState;
    }

    case ACTIONS.Types.DELETE_PARTICLES: {
      let newState = _.cloneDeep(state);
      let index = _.findIndex(newState.particles, { id: action.payload });
      newState.particles.splice(index, 1);
      return newState;
    }

    default:
      return state;
  }
};

export default particleReducer;