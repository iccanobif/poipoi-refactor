import { Player } from "./users";
import { ChessInstance } from "chess.js"
import { RenderCache } from "@/rendercache";

const JanusClient = require('janus-videoroom-client').Janus;

export type Direction = 'up' | 'down' | 'left' | 'right'
export type Area = 'for' | 'gen'

export interface Coordinates
{
    x: number;
    y: number;
}

export interface StreamSlot
{
    isActive: boolean,
    isReady: boolean,
    withSound: boolean | null,
    withVideo: boolean | null,
    userId: string | null,
    publisherId: number | null,
    isPrivateStream: boolean | null,
}

export interface Door
{
    x: number;
    y: number;
    direction: Direction | null;
    target: {
        roomId: string
        doorId: string
    } | null;
}

export interface WorldSpawn
{
    x: number;
    y: number;
    direction: Direction | null;
}

export interface RoomObject
{
    x: number;
    y: number;
    url: string;
    scale?: number;
    offset?: {
        x: number;
        y: number;
    }
    xOffset?: number;
    yOffset?: number;
    image?: RenderCache, // for frontend use only
    physicalPositionX?: number, // for frontend use only
    physicalPositionY?: number, // for frontend use only
}

export interface Room
{
    id: string;
    scale: number;
    size: Coordinates;
    originCoordinates: Coordinates;
    backgroundImageUrl: string;
    backgroundColor?: string;
    backgroundOffset?: Coordinates;
    spawnPoint: string;
    needsFixedCamera?: boolean;
    isBackgroundImageOffsetEdge?: boolean;
    objects: RoomObject[];
    sit: Coordinates[];
    blocked: Coordinates[];
    forbiddenMovements: { xFrom: number, yFrom: number, xTo: number, yTo: number }[],
    doors: { [doorId: string]: Door };
    worldSpawns?: WorldSpawn[];
    streamSlotCount: number;
    secret?: boolean;
    forcedAnonymous?: boolean;
    blockWidth?: number;
    blockHeight?: number;
    hasChessboard?: boolean;
}

export interface JanusServer
{
    id: string;
    client: typeof JanusClient;
}

export type RoomStateCollection = {
    [areaId: string]: { [roomId: string]: RoomState }
}

export interface RoomState
{
    streams: StreamSlot[],
    janusRoomServer: JanusServer | null,
    janusRoomIntName: number | null,
    janusRoomName: string | null,
    chess: ChessboardState
}

export interface RoomStateDto
{
    currentRoom: Room,
    connectedUsers: PlayerDto[],
    streams: StreamSlotDto[],
    chessboardState: ChessboardStateDto
}

export interface LoginResponseDto
{
    appVersion: number,
    isLoginSuccessful: boolean,
    error?: "invalid_username" | "ip_restricted",
    userId?: string,
    privateUserId?: string,
}

export interface PlayerDto
{
    id: string,
    name: string,
    position: { x: number, y: number },
    direction: Direction,
    roomId: string,
    characterId: string,
    isInactive: boolean,
    bubblePosition: Direction,
    voicePitch: number,
    lastRoomMessage: string,
}

// export interface StreamSlotDto
// {
//     isActive: true,
//     isReady: boolean,
//     withSound: boolean | null,
//     withVideo: boolean | null,
//     userId: string | null,
// }

export type StreamSlotDto = ActiveStreamSlotDto | InactiveStreamSlotDto

export interface ActiveStreamSlotDto
{
    isActive: true,
    isReady: boolean,
    withSound: boolean,
    withVideo: boolean,
    userId: string,
}
export interface InactiveStreamSlotDto
{
    isActive: false,
    isReady: false,
    withSound: false,
    withVideo: false,
    userId: null,
}

export interface ChessboardState {
    instance: ChessInstance | null,
    blackUserID: string | null,
    whiteUserID: string | null,
    lastMoveTime: number | null,
    timer: any
}

export interface ChessboardStateDto
{
    fenString: string | null,
    blackUserID: string | null,
    whiteUserID: string | null,
    turn: "b" | "w" | null,
}

export interface PersistedState
{
    users: Player[],
}

export interface CharacterSvgDto
{
    isBase64: boolean
    frontSitting: string
    frontStanding: string
    frontWalking1: string
    frontWalking2: string
    backSitting: string
    backStanding: string
    backWalking1: string
    backWalking2: string
}

export interface RoomListItemDto
{
    id: string,
    userCount: number,
    streamers: string[]
}

export interface RoomListItem extends RoomListItemDto
{
    sortName: string,
    streamerCount: number,
    streamerDisplayNames: string[]
}