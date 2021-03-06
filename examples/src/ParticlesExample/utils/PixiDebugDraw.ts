/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

import * as box2d from "@flyover/box2d";
import { Graphics, Application } from "pixi.js"

export class Camera {
  public readonly m_center: box2d.b2Vec2 = new box2d.b2Vec2(0, 20);
  ///public readonly m_roll: box2d.b2Rot = new box2d.b2Rot(box2d.b2DegToRad(0));
  public m_extent: number = 25;
  public m_zoom: number = 1;
  public m_width: number = 1280;
  public m_height: number = 800;

  public ConvertScreenToWorld(screenPoint: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2 {
    return this.ConvertElementToWorld(screenPoint, out);
  }

  public ConvertWorldToScreen(worldPoint: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2 {
    return this.ConvertWorldToElement(worldPoint, out);
  }

  public ConvertViewportToElement(viewport: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2 {
    // 0,0 at center of canvas, x right and y up
    const element_x: number = viewport.x + (0.5 * this.m_width);
    const element_y: number = (0.5 * this.m_height) - viewport.y;
    return out.Set(element_x, element_y);
  }

  public ConvertElementToViewport(element: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2 {
    // 0,0 at center of canvas, x right and y up
    const viewport_x: number = element.x - (0.5 * this.m_width);
    const viewport_y: number = (0.5 * this.m_height) - element.y;
    return out.Set(viewport_x, viewport_y);
  }

  public ConvertProjectionToViewport(projection: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2 {
    const viewport: box2d.b2Vec2 = out.Copy(projection);
    box2d.b2Vec2.MulSV(1 / this.m_zoom, viewport, viewport);
    ///box2d.b2Vec2.MulSV(this.m_extent, viewport, viewport);
    box2d.b2Vec2.MulSV(0.5 * this.m_height / this.m_extent, projection, projection);
    return viewport;
  }

  public ConvertViewportToProjection(viewport: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2 {
    const projection: box2d.b2Vec2 = out.Copy(viewport);
    ///box2d.b2Vec2.MulSV(1 / this.m_extent, projection, projection);
    box2d.b2Vec2.MulSV(2 * this.m_extent / this.m_height, projection, projection);
    box2d.b2Vec2.MulSV(this.m_zoom, projection, projection);
    return projection;
  }

  public ConvertWorldToProjection(world: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2 {
    const projection: box2d.b2Vec2 = out.Copy(world);
    box2d.b2Vec2.SubVV(projection, this.m_center, projection);
    ///box2d.b2Rot.MulTRV(this.m_roll, projection, projection);
    return projection;
  }

  public ConvertProjectionToWorld(projection: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2 {
    const world: box2d.b2Vec2 = out.Copy(projection);
    ///box2d.b2Rot.MulRV(this.m_roll, world, world);
    box2d.b2Vec2.AddVV(this.m_center, world, world);
    return world;
  }

  public ConvertElementToWorld(element: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2 {
    const viewport: box2d.b2Vec2 = this.ConvertElementToViewport(element, out);
    const projection: box2d.b2Vec2 = this.ConvertViewportToProjection(viewport, out);
    return this.ConvertProjectionToWorld(projection, out);
  }

  public ConvertWorldToElement(world: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2 {
    const projection: box2d.b2Vec2 = this.ConvertWorldToProjection(world, out);
    const viewport: box2d.b2Vec2 = this.ConvertProjectionToViewport(projection, out);
    return this.ConvertViewportToElement(viewport, out);
  }

  public ConvertElementToProjection(element: box2d.b2Vec2, out: box2d.b2Vec2): box2d.b2Vec2 {
    const viewport: box2d.b2Vec2 = this.ConvertElementToViewport(element, out);
    return this.ConvertViewportToProjection(viewport, out);
  }
}

// This class implements debug drawing callbacks that are invoked
// inside b2World::Step.
export class PixiDebugDraw extends box2d.b2Draw {
  private app: Application;
  private graphics: Graphics;
  private scale = 100;

  constructor(app: Application, graphics: Graphics) {
    super();
    this.app = app;
    this.graphics = graphics;
  }

  public PushTransform(xf: box2d.b2Transform): void {

  }

  public PopTransform(xf: box2d.b2Transform): void {

  }

  public DrawPolygon(vertices: box2d.b2Vec2[], vertexCount: number, color: box2d.b2Color): void {
    console.log('DrawPolygon');
  }

  protected drawPolygon(vertices: box2d.b2Vec2[], vertexCount: number, color: box2d.b2Color, fill: boolean): void {
    let pixiColor = 0;
    this.graphics.lineStyle(1, pixiColor, 1);
    if (fill) {
      this.graphics.beginFill(pixiColor, 0.5);
    }
    for (let i = 0; i < vertexCount; i++) {
      var vert = vertices[i];
      // the world coordinates in Y direction of Box2D are exactly the opposite in Pixi
      // so we swap these
      if (i == 0)
        this.graphics.moveTo(vert.x * this.scale + this.app.screen.width / 2, this.app.screen.height - vert.y * this.scale);
      else
        this.graphics.lineTo(vert.x * this.scale + this.app.screen.width / 2, this.app.screen.height - vert.y * this.scale);
    }
    if (fill) {
      this.graphics.endFill();
    }

  }

  public DrawSolidPolygon(vertices: box2d.b2Vec2[], vertexCount: number, color: box2d.b2Color): void {
    console.log('DrawSolidPolygon');
    this.drawPolygon(vertices, vertexCount, color, true);
  }

  public DrawCircle(center: box2d.b2Vec2, radius: number, color: box2d.b2Color): void {
    console.log('DrawCircle');
    this.graphics.beginFill(0);
    this.graphics.drawCircle(center.x, center.y, radius * this.scale);
    this.graphics.endFill();
  }

  public DrawSolidCircle(center: box2d.b2Vec2, radius: number, axis: box2d.b2Vec2, color: box2d.b2Color): void {

  }

  // #if B2_ENABLE_PARTICLE
  public DrawParticles(centers: box2d.b2Vec2[], radius: number, colors: box2d.b2Color[] | null, count: number) {

  }
  // #endif

  public DrawSegment(p1: box2d.b2Vec2, p2: box2d.b2Vec2, color: box2d.b2Color): void {

  }

  public DrawTransform(xf: box2d.b2Transform): void {

  }

  public DrawPoint(p: box2d.b2Vec2, size: number, color: box2d.b2Color): void {

  }

  private static DrawString_s_color: box2d.b2Color = new box2d.b2Color(0.9, 0.6, 0.6);
  public DrawString(x: number, y: number, message: string): void {

  }

  private static DrawStringWorld_s_p: box2d.b2Vec2 = new box2d.b2Vec2();
  private static DrawStringWorld_s_cc: box2d.b2Vec2 = new box2d.b2Vec2();
  private static DrawStringWorld_s_color: box2d.b2Color = new box2d.b2Color(0.5, 0.9, 0.5);
  public DrawStringWorld(x: number, y: number, message: string): void {

  }

  public DrawAABB(aabb: box2d.b2AABB, color: box2d.b2Color): void {

  }
}

export const g_camera: Camera = new Camera();
