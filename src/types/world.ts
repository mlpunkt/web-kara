import { writable } from 'svelte/store';

export interface Position {
    x: number,
    y: number,
}

export enum Direction {
    UP = "UP",
    RIGHT = "RIGHT",
    DOWN = "DOWN",
    LEFT = "LEFT",
}

export function direction_cw(direction) {
    if (direction === Direction.UP) {
        return Direction.RIGHT;
    }

    if (direction === Direction.RIGHT) {
        return Direction.DOWN;
    }

    if (direction === Direction.DOWN) {
        return Direction.LEFT;
    }

    if (direction === Direction.LEFT) {
        return Direction.UP;
    }
}

export function direction_ccw(direction) {
    if (direction === Direction.UP) {
        return Direction.LEFT;
    }

    if (direction === Direction.RIGHT) {
        return Direction.UP;
    }

    if (direction === Direction.DOWN) {
        return Direction.RIGHT;
    }

    if (direction === Direction.LEFT) {
        return Direction.DOWN;
    }
}


export function direction_rotationDegrees(direction) {
    if (direction === Direction.UP) {
        return 270;
    }

    if (direction === Direction.RIGHT) {
        return 0;
    }

    if (direction === Direction.DOWN) {
        return 90;
    }

    if (direction === Direction.LEFT) {
        return 180;
    }
}

// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
const mod = (a, n) => ((a % n) + n) % n;

function fitPositionToWorld(pos: Position, sizeX: number, sizeY: number) {
    return {
        x: mod(pos.x, sizeX),
        y: mod(pos.y, sizeY),
    };
}

function positionFront(direction: Direction, pos: Position, sizeX: number, sizeY: number) {
    if (direction === Direction.DOWN) {
        return fitPositionToWorld({x: pos.x, y: pos.y + 1}, sizeX, sizeY);
    } else if (direction === Direction.LEFT) {
        return fitPositionToWorld({x: pos.x - 1, y: pos.y}, sizeX, sizeY);
    } else if (direction === Direction.UP) {
        return fitPositionToWorld({x: pos.x, y: pos.y - 1}, sizeX, sizeY);
    } else if (direction === Direction.RIGHT) {
        return fitPositionToWorld({x: pos.x + 1, y: pos.y}, sizeX, sizeY);
    }
}

function positionLeft(direction: Direction, pos: Position, sizeX: number, sizeY: number) {
    if (direction === Direction.DOWN) {
        return fitPositionToWorld({x: pos.x + 1, y: pos.y}, sizeX, sizeY);
    } else if (direction === Direction.LEFT) {
        return fitPositionToWorld({x: pos.x, y: pos.y + 1}, sizeX, sizeY);
    } else if (direction === Direction.UP) {
        return fitPositionToWorld({x: pos.x - 1, y: pos.y}, sizeX, sizeY);
    } else if (direction === Direction.RIGHT) {
        return fitPositionToWorld({x: pos.x, y: pos.y - 1}, sizeX, sizeY);
    }
}

function positionRight(direction: Direction, pos: Position, sizeX: number, sizeY: number) {
    if (direction === Direction.DOWN) {
        return fitPositionToWorld({x: pos.x - 1, y: pos.y}, sizeX, sizeY);
    } else if (direction === Direction.LEFT) {
        return fitPositionToWorld({x: pos.x, y: pos.y - 1}, sizeX, sizeY);
    } else if (direction === Direction.UP) {
        return fitPositionToWorld({x: pos.x + 1, y: pos.y}, sizeX, sizeY);
    } else if (direction === Direction.RIGHT) {
        return fitPositionToWorld({x: pos.x, y: pos.y + 1}, sizeX, sizeY);
    }
}

export function world_fieldHasTree(world, pos: Position) {
    const found = world.trees.find(posOfTree => posOfTree.x === pos.x && posOfTree.y === pos.y);

    if (found !== null && found !== undefined) {
        return true;
    } else {
        return false;
    }
}

export function world_fieldHasMushroom(world, pos: Position) {
    const found = world.mushrooms.find(posOfTree => posOfTree.x === pos.x && posOfTree.y === pos.y);

    if (found !== null && found !== undefined) {
        return true;
    } else {
        return false;
    }
}

export function world_fieldHasLeaf(world: World, pos: Position) {
    const found = world.leaves.find(posOfTree => posOfTree.x === pos.x && posOfTree.y === pos.y);

    if (found !== null && found !== undefined) {
        return true;
    } else {
        return false;
    }
}

export function world_treeFront(world: World) {
    const posFront = positionFront(world.kara.direction, world.kara.position, world.sizeX, world.sizeY);

    return world_fieldHasTree(world, posFront);
}

export function world_mushroomFront(world: World) {
    const posFront = positionFront(world.kara.direction, world.kara.position, world.sizeX, world.sizeY);

    return world_fieldHasMushroom(world, posFront);
}

export function world_treeLeft(world: World) {
    const posLeft = positionLeft(world.kara.direction, world.kara.position, world.sizeX, world.sizeY);

    return world_fieldHasTree(world, posLeft);
}

export function world_treeRight(world: World) {
    const posRight = positionRight(world.kara.direction, world.kara.position, world.sizeX, world.sizeY);

    return world_fieldHasTree(world, posRight);
}

export function world_karaOnLeaf(world: World) {
    return world_fieldHasLeaf(world, world.kara.position);
}

export interface World {
    sizeX: number,
    sizeY: number,

    kara: {
        position: Position,
        direction: Direction,
    },

    trees: Array<Position>;

    leaves: Array<Position>;

    mushrooms: Array<Position>;
}

// export const initialWorld = {
//     sizeX: 6,
//     sizeY: 6,

//     kara: {
//         position: {x: 0, y: 1},
//         direction: Direction.RIGHT
//     },

//     trees: [{x: 3, y: 1}] as Array<Position>,

//     leaves: [{x: 0, y: 0}] as Array<Position>,

//     mushrooms: [{x: 3, y: 3}] as Array<Position>,
// } as World

export const initialWorld = {
    sizeX: 6,
    sizeY: 6,

    kara: {
        position: {x: 1, y: 1},
        direction: Direction.RIGHT
    },

    trees: [] as Array<Position>,

    leaves: [] as Array<Position>,

    mushrooms: [] as Array<Position>,
} as World

export const world = writable(initialWorld);

export const worldBeforeLastRun = writable(initialWorld);

export const worldHeight = writable(300);