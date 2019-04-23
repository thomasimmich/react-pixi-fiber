import * as box2d from "@flyover/box2d";
export class DebugSettings {
    public hz: number = 60;
    public velocityIterations: number = 8;
    public positionIterations: number = 3;
    // #if B2_ENABLE_PARTICLE
    // Particle iterations are needed for numerical stability in particle
    // simulations with small particles and relatively high gravity.
    // b2CalculateParticleIterations helps to determine the number.
    public particleIterations: number = box2d.b2CalculateParticleIterations(10, 0.04, 1 / this.hz);
    // #endif
    public drawShapes: boolean = true;
    // #if B2_ENABLE_PARTICLE
    public drawParticles: boolean = true;
    // #endif
    public drawJoints: boolean = true;
    public drawAABBs: boolean = false;
    public drawContactPoints: boolean = false;
    public drawContactNormals: boolean = false;
    public drawContactImpulse: boolean = false;
    public drawFrictionImpulse: boolean = false;
    public drawCOMs: boolean = false;
    public drawControllers: boolean = true;
    public drawStats: boolean = false;
    public drawProfile: boolean = false;
    public enableWarmStarting: boolean = true;
    public enableContinuous: boolean = true;
    public enableSubStepping: boolean = false;
    public enableSleep: boolean = true;
    public pause: boolean = false;
    public singleStep: boolean = false;
    // #if B2_ENABLE_PARTICLE
    public strictContacts: boolean = false;
    // #endif
  }