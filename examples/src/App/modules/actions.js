// types of action
const Types = {
    CREATE_PARTICLES: "CREATE_PARTICLES",
    DELETE_PARTICLES: "DELETE_PARTICLES"
  };

  // actions
  const createParticle = describtion => ({
    type: Types.CREATE_PARTICLES,
    payload: describtion
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