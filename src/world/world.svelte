<script lang="ts">
    import Kara from './kara.svelte';
    import Tree from './tree.svelte';
    import Leaf from './leaf.svelte';
    import Mushroom from './mushroom.svelte';

    import { range } from 'fp-ts/NonEmptyArray'

    import {direction_rotationDegrees, world} from '../types/world';
    import {uiState, EditMode } from '../types/uiState';
    import { kara_setPosition, world_deleteEverythingFromField, world_toggleLeaf, world_toggleMushroom, world_toggleTree } from '../actions';
    import { worldHeight } from '../types/world';

    const fieldSize = 50;

    $: karaPosStr = ($world.kara.position.x * fieldSize).toString() + ',' + ($world.kara.position.y * fieldSize).toString()
    $: translateKara = 'translate(' + karaPosStr + ')';
    $: rotateKara = 'rotate(' + direction_rotationDegrees($world.kara.direction)  + ',25,25)';
    $: viewBox = '0 0 ' + $world.sizeX * fieldSize + ' ' + $world.sizeY * fieldSize;

    function handleMouseAction(x: number, y: number) {
        if ($uiState.editMode === EditMode.KARA) {
            kara_setPosition({x, y});
        } else if($uiState.editMode === EditMode.TREE) {
            world_toggleTree({x, y});
        } else if($uiState.editMode === EditMode.LEAF) {
            world_toggleLeaf({x, y});
        } else if($uiState.editMode === EditMode.MUSHROOM) {
            world_toggleMushroom({x, y});
        } else if($uiState.editMode === EditMode.DELETE) {
            world_deleteEverythingFromField({x, y})
        }
    }

    function handleMouseDown(x: number, y: number) {
        handleMouseAction(x, y);
    }

    function handleMouseEnter(event: MouseEvent, x: number, y: number) {
        if (event.buttons === 1) {
            handleMouseAction(x, y);
        }
    }

    export function getSvgString() {
        if (svgCanvas) {
            return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="'+ viewBox + '">' + svgCanvas.innerHTML + '</svg>';
        }
    }

    let svgCanvas;
</script>

<!-- <svg style="height: 300px;" viewBox={viewBox}> -->
<svg 	bind:this={svgCanvas} viewBox={viewBox} style="height: {$worldHeight * $world.sizeY}px">
    <!-- Klickflächen  -->

    {#each range(0, $world.sizeX - 1) as x}
        {#each range(0, $world.sizeY - 1) as y}
            <rect 
                x={x*fieldSize}
                y={y*fieldSize}
                width="50"
                height="50" 
                on:mousedown={(event) => handleMouseDown(x, y)}
                on:mouseenter={event => handleMouseEnter(event, x, y)}
                style="fill:white"
            ></rect>
        {/each}
    {/each}


    <!-- Gitter vertikal -->
    {#each range(0, $world.sizeX) as i}
        <line x1={i * fieldSize} y1={0} x2={i * fieldSize} y2={$world.sizeY * fieldSize} stroke="black"></line>
    {/each}

    <!-- Gitter horizontal -->
    {#each range(0, $world.sizeY) as i}
        <line x1={0} y1={i * fieldSize} x2={$world.sizeX * fieldSize} y2={i * fieldSize} stroke="black"></line>
    {/each}

    <!-- Blätter  -->
    {#each $world.leaves as pos}
        <g transform={"translate(" + pos.x * fieldSize + " " + pos.y*fieldSize + ")"}>
            <Leaf />
        </g>
    {/each}


    <!-- kara -->
    <g transform={translateKara + ' ' + rotateKara}>
        <Kara />
        <!-- <iconKara /> -->
    </g>

    <!-- Bäume  -->
    {#each $world.trees as pos}
        <g transform={"translate(" + pos.x * fieldSize + " " + pos.y*fieldSize + ")"}>
            <Tree />
        </g>
    {/each}

    <!-- Pilze -->
    {#each $world.mushrooms as pos}
        <g transform={"translate(" + pos.x * fieldSize + " " + pos.y*fieldSize + ")"}>
            <Mushroom />
        </g>
    {/each}
</svg>