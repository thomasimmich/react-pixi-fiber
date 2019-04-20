// types of action
const Types = {
    CREATE_PARTICLES: "CREATE_PARTICLES",
    DELETE_PARTICLES: "DELETE_PARTICLES"
  };

  // actions
  const createParticle = description => ({
    type: Types.CREATE_PARTICLES,
    payload: description
  });
  
  const deleteParticle = id => ({
    type: Types.DELETE_PARTICLES,
    payload: id
  });
  
  export default {
    createItem: createParticle,
    deleteItem: deleteParticle,
    Types
  };