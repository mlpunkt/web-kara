import type { EditMode, UiState } from './types/uiState';
import {Direction, direction_ccw, direction_cw, initialWorld, Position, World, world, world_fieldHasLeaf, world_fieldHasMushroom, world_fieldHasTree} from './types/world';
import {uiState} from './types/uiState';

import {DialogState, dialogState} from './types/dialogState';
import { Output, output, OutputItem, OutputItemType } from './types/output';

let worldSubscription = initialWorld;
world.subscribe(newWorld => worldSubscription = newWorld);


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
    return !(pos1.x === pos2.x && pos1.y == pos2.y);
}

// export function kara_move() {
//     world.update((world: World) => {
//         const nextPosition = nextPositionInDirection(world.kara.position, world.kara.direction, world.sizeX, world.sizeY);

//         if (world_fieldHasTree(world, nextPosition)) {
//             // kara steht vor einem Baum
//             // kara kann in diese Richtung nicht laufen        
//             dialog_openMessageDialog('Fehler', 'Kara steht vor einem Baum und kann deshalb keinen Schritt machen.');
//             return world;
//         } else if(world_fieldHasMushroom(world, nextPosition)) {
//             // kara steht vor einem Pilz
//             const positonBehindMushroom = nextPositionInDirection(nextPosition, world.kara.direction, world.sizeX, world.sizeY);
//             if (world_fieldHasTree(world, positonBehindMushroom) || world_fieldHasMushroom(world, positonBehindMushroom)) {
//                 // hinter dem Pilz ist ein Baum oder ein anderer Pilz
//                 // kara kann in diese Richtung nicht laufen
//                 dialog_openMessageDialog('Fehler', 'Hinter dem Pilz ist ein Hindernis. Deshalb keinen Schritt machen.');
//                 return world;                
//             } else {
//                 // kara kann den Pilz verschieben
//                 return {
//                     ...world,
//                     kara: {
//                         ...world.kara,
//                         position: nextPosition,                        
//                     },
//                     mushrooms: [
//                         ...world.mushrooms.filter(position_notEqual(nextPosition)),
//                         positonBehindMushroom
//                     ]
//                 }
//             }
//         } else {
//             // kara steht vor einem leeren Feld oder vor einem Blatt
//             // kara läuft einen Schritt
//             return {
//                 ...world,
//                 kara: {
//                     ...world.kara,
//                     position: nextPositionInDirection(world.kara.position, world.kara.direction, world.sizeX, world.sizeY),
//                 }
//             } as World;
//         }
//     });
// }

export function kara_move() {
    const nextPosition = nextPositionInDirection(worldSubscription.kara.position, worldSubscription.kara.direction, worldSubscription.sizeX, worldSubscription.sizeY);

    if (world_fieldHasTree(worldSubscription, nextPosition)) {
        // kara steht vor einem Baum
        // kara kann in diese Richtung nicht laufen        
        return {
            message: 'Kara steht vor einem Baum und kann deshalb keinen Schritt machen.'
        }

    } else if(world_fieldHasMushroom(worldSubscription, nextPosition)) {
        // kara steht vor einem Pilz
        const positonBehindMushroom = nextPositionInDirection(nextPosition, worldSubscription.kara.direction, worldSubscription.sizeX, worldSubscription.sizeY);
        if (world_fieldHasTree(worldSubscription, positonBehindMushroom) || world_fieldHasMushroom(worldSubscription, positonBehindMushroom)) {
            // hinter dem Pilz ist ein Baum oder ein anderer Pilz
            // kara kann in diese Richtung nicht laufen
            return {
                message: 'Hinter dem Pilz ist ein Hindernis. Deshalb kann Kara keinen Schritt machen.'
            }
        } else {
            // kara kann den Pilz verschieben
            world.update((world: World) => {
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
            });
        }
    } else {
        // kara steht vor einem leeren Feld oder vor einem Blatt
        // kara läuft einen Schritt
        world.update((world: World) => {
            return {
                ...world,
                kara: {
                    ...world.kara,
                    position: nextPositionInDirection(world.kara.position, world.kara.direction, world.sizeX, world.sizeY),
                }
            } as World;
        })
    }
};



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
    // Falls sich ein Pilz oder ein Baum auf pos befindet: Entfernen
    const mushroomsNew = worldSubscription.mushrooms.filter(position_equalsNot(pos));
    const treesNew = worldSubscription.trees.filter(position_equalsNot(pos));

    world.update((world: World) => {
        return {
            ...world,
            kara: {
                ...world.kara,
                position: pos,
            },
            mushrooms: mushroomsNew,
            trees: treesNew,
        }
    });
}

export function kara_putLeaf() {
    return world_putLeaf(worldSubscription.kara.position);
}

export function kara_removeLeaf() {
    return world_removeLeaf(worldSubscription.kara.position);
}

export function world_toggleTree(pos: Position) {
    if (position_equalsNot(worldSubscription.kara.position)(pos)) {
        // Kara sitzt nicht auf pos
        
        world.update((world: World) => {
            // const newTreeArray = world_fieldHasTree(world, pos)
            //     ? world.trees.filter(treePos => !(treePos.x === pos.x && treePos.y === pos.y))
            //     : [...world.trees, pos]
            if (world_fieldHasTree(world, pos)) {
                // Baum entfernen
                const newTreeArray = world.trees.filter(treePos => !(treePos.x === pos.x && treePos.y === pos.y));
                return {
                    ...world,
                    trees: newTreeArray,
                }
            } else {
                // Baum hinzufügen
                const newTreeArray = [...world.trees, pos];

                // Falls ein Pilz oder ein Blatt auf pos sitzt: entfernen
                const newLeaves = world.leaves.filter(position_equalsNot(pos));
                const newMushrooms = world.mushrooms.filter(position_equalsNot(pos));

                return {
                    ...world,
                    trees: newTreeArray,
                    leaves: newLeaves,
                    mushrooms: newMushrooms,
                }
            }

        });
    }

}

export function world_toggleLeaf(pos: Position) {
    world.update((world: World) => {
        if (world_fieldHasLeaf(world, pos)) {
            // Blatt entfernen
            const newLeaves = world.leaves.filter(leafPos => !(leafPos.x === pos.x && leafPos.y === pos.y));
            return {
                ...world,
                leaves: newLeaves,
            }
        } else {
            // Blatt hinzufügen
            const newLeaves = [...world.leaves, pos];

            // Falls ein Baum auf dieser Position ist: entfernen
            const newTrees =  world.trees.filter(position_equalsNot(pos));

            return {
                ...world,
                leaves: newLeaves,
                trees: newTrees,
            }
        }
    });
}

export function world_toggleMushroom(pos: Position) {
    if (position_equalsNot(worldSubscription.kara.position)(pos)) {
        // Kara sitzt nicht auf pos
        world.update((world: World) => {
            if (world_fieldHasMushroom(world, pos)) {
                // Pilz entfernen
                const newMushrooms = world.mushrooms.filter(mushroomPos => !(mushroomPos.x === pos.x && mushroomPos.y === pos.y));
                return {
                    ...world,
                    mushrooms: newMushrooms,
                }
            } else {
                // Pilz hinzufügen
                const newMushrooms = [...world.mushrooms, pos];

                // Falls ein Baum auf dieser Position ist: entfernen
                const newTrees = world.trees.filter(position_equalsNot(pos));
                return {
                    ...world,
                    mushrooms: newMushrooms,
                    trees: newTrees,
                }
            }
        });
    }
}

export function world_putLeaf(pos: Position) {
    if (world_fieldHasLeaf(worldSubscription, pos)) {
        return {
            message: 'Auf dem Feld befindet sich bereits ein Blatt. Deshalb kann Kara kein Blatt legen.',
        }
    } else {
        world.update((world: World) => {
            return {
                ...world,
                leaves: [...world.leaves, pos],
            }        
        });
    }

}

export function world_removeLeaf(pos: Position) {
    if (world_fieldHasLeaf(worldSubscription, pos)) {
        world.update((world: World) => {
            return {
                ...world,
                leaves: world.leaves.filter(leafPos => !(leafPos.x === pos.x && leafPos.y === pos.y)),
            }        
        });
    } else {
        return {
            message: 'Auf dem Feld befindet sich kein Blatt. Kara kann deshalb kein Blatt aufheben.',
        }
    }
}

export function world_deleteEverythingFromField(pos: Position) {
    world.update((world: World) => ({
        ...world,

        trees: world.trees.filter(position_equalsNot(pos)),
        leaves: world.leaves.filter(position_equalsNot(pos)),
        mushrooms: world.mushrooms.filter(position_equalsNot(pos)),
    }));
}

const position_isInWorld = (sizeX: number, sizeY: number) => (position: Position) => position.x < sizeX && position.y < sizeY;
const position_isNotOrigin = (position: Position) => !(position.x === 0 && position.y === 0);
const position_equalsNot = (pos1: Position) => (pos2: Position) => !(pos1.x === pos2.x && pos1.y === pos2.y);

export function world_setSize(sizeXNew: number, sizeYNew: number) {
    let position_isInNewWorld = position_isInWorld(sizeXNew, sizeYNew)
    const newTrees = worldSubscription.trees.filter(position_isInNewWorld);
    const newLeaves = worldSubscription.leaves.filter(position_isInNewWorld);
    const newMushrooms = worldSubscription.mushrooms.filter(position_isInNewWorld);

    if (position_isInNewWorld(worldSubscription.kara.position)) {
        // Kara ist in der neuen Welt
        world.update((world: World) => {
            return {
                ...world,
                trees: newTrees,
                leaves: newLeaves,
                mushrooms: newMushrooms,
                sizeX: sizeXNew,
                sizeY: sizeYNew,
            }
        });
    } else {
        // Kara ist außerhalb der neuen Welt: Kara auf Position (0,0) setzen, damit Kara sicher in der neuen Welt ist
        // Falls ein Baum oder ein Pilz auf Position (0,0) ist: entfernen, damit Kara dort sitzen kann
        world.update((world: World) => {
            return {
                ...world,
                kara: {
                    ...world.kara,
                    position:{x: 0, y:0},
                },
                trees: newTrees.filter(position_isNotOrigin),
                leaves: newLeaves,
                mushrooms: newMushrooms.filter(position_isNotOrigin),
                sizeX: sizeXNew,
                sizeY: sizeYNew,
            }
        });
    }
}

export function world_set(newWorld: World) {
    world.set(newWorld);
}

export function uiState_setEditMode(editMode: EditMode) {
    uiState.update((uiState: UiState) => {
        return {
            ...uiState,
            editMode: editMode,
        }
    });
}

export function dialog_openChangeSizeDialog() {
    dialogState.update(dialogState => ({
        ...dialogState,
        changeSize: {
            ...dialogState.changeSize,
            isOpen: true,
        }
    }))
}

export function dialog_closeChangeSizeDialog() {
    dialogState.update(dialogState => ({
        ...dialogState,
        changeSize: {
            ...dialogState.changeSize,
            isOpen: false,
        }
    }))
}

export function dialog_openMessageDialog(title: string, message: string) {
    dialogState.update((dialogState: DialogState) => {
        return {
            ...dialogState,
            message: {
                isOpen: true,
                title: title,
                message: message,
            }
        }
    });
}

export function dialog_closeMessageDialog() {
    dialogState.update((dialogState: DialogState) => {
        return {
            ...dialogState,
            message: {
                isOpen: false,
                title: '',
                message: '',
            }
        }
    });    
}

export function dialog_openSaveFileAsDialog(okCallback: (filename: string) => void, filename: string, filenameExtension) {
    dialogState.update((dialogState: DialogState) => {
        return {
            ...dialogState,
            saveFileAs: {
                isOpen: true,
                content: '',
                okCallback: okCallback,
                filename: filename,
                filenameExtension: filenameExtension,
            }
        }
    });
}

export function dialog_closeSaveFileAsDialog() {
    dialogState.update((dialogState: DialogState) => {
        return {
            ...dialogState,
            saveFileAs: {
                ...dialogState.saveFileAs,
                isOpen: false,                
            }
        }
    });
}

export function dialog_openLoadFileDialog(okCallback: (filename: string, contentString: string) => void) {
    dialogState.update((dialogState: DialogState) => {
        return {
            ...dialogState,
            loadFileDialog: {
                ...dialogState.loadFileDialog,
                okCallback: okCallback,
                isOpen: true,                
            }
        }
    });
}

export function dialog_closeLoadFileDialog() {
    dialogState.update((dialogState: DialogState) => {
        return {
            ...dialogState,
            loadFileDialog: {
                ...dialogState.loadFileDialog,
                isOpen: false,                
            }
        }
    });
}

export function output_reset() {
    output.set([] as Array<OutputItem>)
}

export function output_addItem(type: OutputItemType, message: string) {
    output.update(output => [...output, {type, message}]);
}