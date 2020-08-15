import { Body }       from 'p2';
import { BodyState }  from './body-state';
import { PathFinder } from './pathfinding';

export class BodyWithState extends Body {
  bodyState: BodyState;
  changeScenePoint: any    = null;
  isWall: boolean          = false;
  isWorldWall: boolean     = false;
  isRoomObject: boolean    = false;
  roomObject?: any         = null;
  playerId: number         = null;
  isChangingScene: boolean = false;
  pathFinder?: PathFinder;
}
