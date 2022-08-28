import type { EditMode, UiState } from './types/uiState';
import {Direction, direction_ccw, direction_cw, Position, World, world, world_fieldHasLeaf, world_fieldHasMushroom, world_fieldHasTree} from './types/world';
import {uiState} from './types/uiState';

function nextPositionInDirection(position: Position, direction: Direction, sizeX: number, sizeY: number) {
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

const position_equal = (pos1: Position) => (pos2: Position) => {
    return pos1.x === pos2.x && pos1.y && pos2.y;
}

const position_notEqual = (pos1: Position) => (pos2: Position) => {
    return !(pos1.x === pos2.x && pos1.y && pos2.y);
}

export function kara_move() {
    world.update((world: World) => {
        const nextPosition = nextPositionInDirection(world.kara.position, world.kara.direction, world.sizeX, world.sizeY);

        if (world_fieldHasTree(world, nextPosition)) {
            // kara steht vor einem Baum
            // kara kann in diese Richtung nicht laufen
            return world;
        } else if(world_fieldHasMushroom(world, nextPosition)) {
            // kara steht vor einem Pilz
            const positonBehindMushroom = nextPositionInDirection(nextPosition, world.kara.direction, world.sizeX, world.sizeY);
            if (world_fieldHasTree(world, positonBehindMushroom) || world_fieldHasMushroom(world, positonBehindMushroom)) {
                // hinter dem Pilz ist ein Baum oder ein anderer Pilz
                // kara kann in diese Richtung nicht laufen
                return world;                
            } else {
                // kara kann den Pilz verschieben
                return {
                    ...world,
                    kara: {
                        ...world.kara,
                        position: nextPosition,                        
                    },
                    mushrooms: [
                        ...world.mushrooms.filter(position_notEqual(nextPosition)),
                        positonBehindMushroom
                    ]
                }
            }
        } else {
            // kara steht vor einem leeren Feld oder vor einem Blatt
            // kara läuft einen Schritt
            return {
                ...world,
                kara: {
                    ...world.kara,
                    position: nextPositionInDirection(world.kara.position, world.kara.direction, world.sizeX, world.sizeY),
                }
            } as World;
        }
    });
}

export function kara_turnRight() {
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

export function kara_turnLeft() {
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

export function world_toggleMushroom(pos: Position) {
    world.update((world: World) => {
        const newMushroomArray = world_fieldHasMushroom(world, pos)
            ? world.mushrooms.filter(mushroomPos => !(mushroomPos.x === pos.x && mushroomPos.y === pos.y))
            : [...world.mushrooms, pos]

        return {
            ...world,
            mushrooms: newMushroomArray,
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