import type { EditMode, UiState } from './types/uiState';
import {Direction, direction_ccw, direction_cw, Position, World, world, world_fieldHasLeaf, world_fieldHasTree} from './types/world';
import {uiState} from './types/uiState';

function kara_move_newPosition(position: Position, direction: Direction, sizeX: number, sizeY: number) {
    if (direction === Direction.UP) {
        if (position.y - 1 < 0) {
            return ({
                x: position.x,
                y: position.y + sizeY - 1,
            })
        } else {
            return ({
                x: position.x,
                y: position.y - 1,
            })
        }
    }

    if (direction === Direction.RIGHT) {
        if (position.x + 1 >= sizeX) {
            return ({
                x: 0,
                y: position.y,
            })
        } else {
            return ({
                x: position.x + 1,
                y: position.y,
            })
        }
    }

    if (direction === Direction.DOWN) {
        if (position.y + 1 >= sizeY) {
            return ({
                x: position.x,
                y: 0,
            })
        } else {
            return ({
                x: position.x,
                y: position.y + 1,
            })
        }
    }

    if (direction === Direction.LEFT) {
        if (position.x - 1 < 0) {
            return ({
                x: position.x + sizeX - 1,
                y: position.y,
            })
        } else {
            return ({
                x: position.x - 1,
                y: position.y,
            })
        }
    }
}

export function kara_move() {
    world.update((world: World) => {
        return {
            ...world,
            kara: {
                ...world.kara,
                position: kara_move_newPosition(world.kara.position, world.kara.direction, world.sizeX, world.sizeY),
            }
        } as World;
    });
}

export function kara_turn_cw() {
    world.update((world: World) => {
        return {
            ...world,
            kara: {
                ...world.kara,
                direction: direction_cw(world.kara.direction),
            }
        } as World;
    });
}

export function kara_turn_ccw() {
    world.update((world: World) => {
        return {
            ...world,
            kara: {
                ...world.kara,
                direction: direction_ccw(world.kara.direction),
            }
        } as World;
    });
}

export function kara_setPosition(pos: Position) {
    world.update((world: World) => {
        return {
            ...world,
            kara: {
                ...world.kara,
                position: pos,
            }
        }
    });
}


export function world_toggleTree(pos: Position) {
    world.update((world: World) => {
        const newTreeArray = world_fieldHasTree(world, pos)
            ? world.trees.filter(treePos => !(treePos.x === pos.x && treePos.y === pos.y))
            : [...world.trees, pos]

        return {
            ...world,
            trees: newTreeArray,
        }
    });
}

export function world_toggleLeaf(pos: Position) {
    world.update((world: World) => {
        const newLeafArray = world_fieldHasLeaf(world, pos)
            ? world.leafs.filter(leafPos => !(leafPos.x === pos.x && leafPos.y === pos.y))
            : [...world.leafs, pos]

        return {
            ...world,
            leafs: newLeafArray,
        }
    });
}

export function world_putLeaf(pos: Position) {
    world.update((world: World) => {
        const newLeafArray = world_fieldHasLeaf(world, pos)
            ? world.leafs
            : [...world.leafs, pos]

        return {
            ...world,
            leafs: newLeafArray,
        }        
    });
}

export function world_removeLeaf(pos: Position) {
    world.update((world: World) => {
        const newLeafArray = world_fieldHasLeaf(world, pos)
            ? world.leafs.filter(leafPos => !(leafPos.x === pos.x && leafPos.y === pos.y))
            : world.leafs

        return {
            ...world,
            leafs: newLeafArray,
        }        
    });
}

export function uiState_setEditMode(editMode: EditMode) {
    uiState.update((uiState: UiState) => {
        return {
            ...uiState,
            editMode: editMode,
        }
    });
}