import { World, Body, Box, WorldOptions } from 'p2';
import { PathFinder }                     from './pathfinding';
import { CONSTANTS }                      from '../../../../game/src/lib/constants';
import { WorldEvents }                    from './events';
import { PhysicalBody }                   from './physical-body';
import { BodyWithState }                  from './body-with-state';
import { BodyState }                      from './body-state';

export interface P2WorldOptions extends WorldOptions {
  roomId: string
  applyGravity: boolean
  applyDamping: boolean
  sceneName: string
  sceneTiledMapFile: string
  tryClosestPath: boolean
  onlyWalkable: boolean
  worldSpeed: number
  objectsManager: any
  pathFinder: PathFinder
}

export class P2World extends World implements P2WorldOptions {
  roomId: string            = '';
  applyGravity: boolean     = false;
  applyDamping: boolean     = false;
  sceneName: string         = '';
  sceneTiledMapFile: string = '';
  tryClosestPath: boolean   = false;
  onlyWalkable: boolean     = false;
  worldSpeed: number        = 1;
  objectsManager: any;
  removeBodies: any[]       = [];
  mapJson: any              = {};
  pathFinder: PathFinder;
  respawnAreas: boolean     = false;
  changePoints: any         = {};

  constructor(options: P2WorldOptions) {
    super(options);
    if (!options.sceneName || !options.sceneTiledMapFile) {
      throw new Error(['World creation missing data in options', JSON.stringify(options, null, 4)].join('\n'));
    }
    this.objectsManager = options.objectsManager;
    if (!this.objectsManager.config.server.maps[options.sceneTiledMapFile]) {
      throw new Error([
        'Map not found:' + options.sceneTiledMapFile + ' In:',
        JSON.stringify(this.objectsManager.config.server.maps, null, 4)].join('\n'));
    }
    this.roomId            = options.roomId;
    this.sceneName         = options.sceneName;
    this.sceneTiledMapFile = options.sceneTiledMapFile;
    this.tryClosestPath    = Boolean(options.tryClosestPath);
    this.onlyWalkable      = Boolean(options.onlyWalkable);
    this.applyDamping      = Boolean(options.applyDamping);
    this.applyGravity      = Boolean(options.applyGravity);
    this.worldSpeed        = this.worldSpeed || 1;
    this.mapJson           = this.objectsManager.config.server.maps[this.sceneTiledMapFile];
    this.respawnAreas      = false;
    this.pathFinder        = new PathFinder();
    this.pathFinder.world  = this;
    this.pathFinder.createGridFromMap();
  }

  /**
   * @param mapData
   */
  async createWorldContent(mapData) {
    // @TODO: analyze and implement blocks groups, for example, all simple collision blocks could be grouped and
    //   use a single big block to avoid the overload number of small blocks which now impacts in the consumed
    //   resources.
    // get scene change points:
    this.changePoints = this.getSceneChangePoints(mapData);
    // map data:
    let mapLayers     = this.mapJson.layers,
        mapW          = this.mapJson.width,
        mapH          = this.mapJson.height,
        tileW         = this.mapJson.tilewidth,
        tileH         = this.mapJson.tileheight;
    for (let layer of mapLayers) {
      let layerData = layer.data;
      await WorldEvents.emit('reldens.parsingMapLayerBefore', layer, this);
      for (let c = 0; c < mapW; c++) {
        let posX = c * tileW + (tileW / 2);
        for (let r = 0; r < mapH; r++) {
          // position in pixels:
          let posY      = r * tileH + (tileH / 2);
          let tileIndex = r * mapW + c;
          let tile      = layerData[tileIndex];
          // the 0 value are empty tiles without collisions or change points:
          if (
            tile !== 0
            && (layer.name.indexOf('change-points') !== -1 || layer.name.indexOf('collisions') !== -1)
          ) {
            this.createCollision(layer.name, tileIndex, tileW, tileH, posX, posY);
            this.pathFinder.grid.setWalkableAt(c, r, false);
          }
          if (tile === 0 && layer.name.indexOf('pathfinder') !== -1) {
            this.pathFinder.grid.setWalkableAt(c, r, false);
          }
          // objects will be found by layer name + tile index:
          let objectIndex = layer.name + tileIndex;
          // this will validate if the object class exists and return an instance of it:
          let roomObject  = this.objectsManager.getObjectData(objectIndex);
          // if the data and the instance was created:
          if (roomObject && !roomObject.multiple) {
            this.createWorldObject(roomObject, objectIndex, tileW, tileH, posX, posY);
          }
        }
      }
      await WorldEvents.emit('reldens.parsingMapLayerAfter', layer, this);
    }
  }

  createCollision(layerName, tileIndex, tileW, tileH, posX, posY) {
    // look for change points on the layers with the proper name convention:
    if (layerName.indexOf('change-points') !== -1) {
      if (this.changePoints[tileIndex]) {
        console.info('Created change point on tileIndex: ' + tileIndex);
        // @NOTE: we make the change point smaller so the user needs to walk into to hit it.
        let bodyChangePoint              = this.createCollisionBody((tileW / 2), (tileH / 2), posX, posY);
        bodyChangePoint.changeScenePoint = this.changePoints[tileIndex];
        this.addBody(bodyChangePoint);
      } else {
        console.error(['Change point data not found in this.changePoints for tileIndex:', tileIndex]);
      }
    }
    // create collisions for layers with the proper name convention:
    if (layerName.indexOf('collisions') !== -1) {
      // create a box to fill the space:
      let bodyWall    = this.createCollisionBody(tileW, tileH, posX, posY);
      bodyWall.isWall = true;
      this.addBody(bodyWall);
    }
  }

  createWorldObject(roomObject, objectIndex, tileW, tileH, posX, posY, pathFinder = null) {
    // handle body fixed position:
    if ({}.hasOwnProperty.call(roomObject, 'xFix')) {
      posX += roomObject.xFix;
    }
    if ({}.hasOwnProperty.call(roomObject, 'yFix')) {
      posY += roomObject.yFix;
    }
    roomObject.x = posX;
    roomObject.y = posY;
    // save position in room object:
    if ({}.hasOwnProperty.call(this.objectsManager.objectsAnimationsData, objectIndex)) {
      this.objectsManager.objectsAnimationsData[objectIndex].x = posX;
      this.objectsManager.objectsAnimationsData[objectIndex].y = posY;
    }
    // check and calculate interaction area:
    if (roomObject.interactionArea) {
      roomObject.setupInteractionArea();
    }
    // by default objects won't have mass:
    let bodyMass = 0;
    // unless it is specified in the object itself:
    if ({}.hasOwnProperty.call(roomObject, 'bodyMass')) {
      bodyMass = roomObject.bodyMass;
    }
    // by default objects collision response:
    let colResponse = false;
    // unless it is specified in the object itself:
    if ({}.hasOwnProperty.call(roomObject, 'collisionResponse')) {
      colResponse = roomObject.collisionResponse;
    }
    // object state:
    let objHasState         = {}.hasOwnProperty.call(roomObject, 'hasState') ? roomObject.hasState : false;
    // create the body:
    let bodyObject          = this.createCollisionBody(tileW, tileH, posX, posY, bodyMass, colResponse, objHasState);
    bodyObject.isRoomObject = true;
    // assign the room object to the body:
    bodyObject.roomObject   = roomObject;
    if (pathFinder) {
      bodyObject.pathFinder = pathFinder;
    }
    console.info('Created object for objectIndex: ' + objectIndex);
    // try to get object instance from project root:
    this.addBody(bodyObject);
    // set data on room object:
    roomObject.state      = bodyObject.bodyState;
    roomObject.objectBody = bodyObject;
  }

  createLimits() {
    // map data:
    let blockW         = this.mapJson.tilewidth,
        blockH         = this.mapJson.tileheight,
        mapW           = this.mapJson.width * blockW,
        mapH           = this.mapJson.height * blockH,
        worldLimit     = 1;
    // create world boundary, up wall:
    let upWall         = this.createCollisionBody((mapW + blockW), worldLimit, (mapW / 2), 1);
    upWall.isWorldWall = true;
    upWall.isWall      = true;
    this.addBody(upWall);
    // create world boundary, down wall:
    let downWall         = this.createCollisionBody((mapW + blockW), worldLimit, (mapW / 2), (mapH - worldLimit));
    downWall.isWorldWall = true;
    downWall.isWall      = true;
    this.addBody(downWall);
    // create world boundary, left wall:
    let leftWall         = this.createCollisionBody(worldLimit, (mapH + blockH), 1, (mapH / 2));
    leftWall.isWorldWall = true;
    leftWall.isWall      = true;
    this.addBody(leftWall);
    // create world boundary, right wall:
    let rightWall         = this.createCollisionBody(worldLimit, (mapH + blockH), (mapW - worldLimit), (mapH / 2));
    rightWall.isWorldWall = true;
    rightWall.isWall      = true;
    this.addBody(rightWall);
  }

  createCollisionBody(width, height, x, y, mass = 1, collisionResponse = true, hasState = false): BodyWithState | PhysicalBody {
    let boxShape   = this.createCollisionShape(width, height, collisionResponse);
    let bodyConfig = {
      mass         : mass,
      position     : [x, y],
      type         : Body.STATIC,
      fixedRotation: true,
    };
    let bodyClass  = BodyWithState;
    if (hasState) {
      bodyClass = PhysicalBody;
    }
    let boxBody = new bodyClass(bodyConfig);
    if (hasState) {
      boxBody.bodyState = new BodyState({
        x    : x,
        y    : y,
        dir  : CONSTANTS.DOWN,
        scene: this.sceneName,
        id   : boxBody.id,
      });
    }
    boxBody.addShape(boxShape);
    return boxBody;
  }

  createCollisionShape(width, height, collisionResponse = true) {
    let boxShape               = new Box({ width: width, height: height });
    boxShape.collisionGroup    = CONSTANTS.COL_GROUND;
    boxShape.collisionMask     = CONSTANTS.COL_PLAYER | CONSTANTS.COL_ENEMY;
    boxShape.collisionResponse = collisionResponse;
    return boxShape;
  }

  getSceneChangePoints(mapData) {
    let changePoints = {};
    for (let i of Object.keys(mapData.changePoints)) {
      let cPoint             = mapData.changePoints[i];
      // example: {"i":167, "n":"other_scene_key_1"}
      changePoints[cPoint.i] = cPoint.n;
    }
    return changePoints;
  }

  createPlayerBody(playerData) {
    let boxShape            = new Box({ width: playerData.width, height: playerData.height });
    boxShape.collisionGroup = CONSTANTS.COL_PLAYER;
    // @TODO: players collision will be configurable, for now when collisions are active players can push players.
    boxShape.collisionMask  = CONSTANTS.COL_ENEMY | CONSTANTS.COL_GROUND | CONSTANTS.COL_PLAYER;
    let boxBody             = new PhysicalBody({
      mass                 : 1,
      position             : [playerData.bodyState.x, playerData.bodyState.y],
      type                 : Body.DYNAMIC,
      fixedRotation        : true,
      animationBasedOnPress: this.objectsManager.config.get('client/players/animations/basedOnPress'),
      diagonalHorizontal   : this.objectsManager.config.get('client/players/animations/diagonalHorizontal'),
    });
    boxBody.addShape(boxShape);
    boxBody.playerId        = playerData.id;
    boxBody.isChangingScene = false;
    boxBody.bodyState       = playerData.bodyState;
    this.addBody(boxBody);
    // return body:
    return boxBody;
  }

}
