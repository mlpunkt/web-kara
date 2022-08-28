<script lang="ts">
    import { uiState_setEditMode } from './actions';
    import { EditMode, uiState } from './types/uiState';

    // https://joshuatz.com/posts/2021/using-svg-files-in-svelte/
    import iconKara from '../assets/kara_normal.svg';
    import iconTree from '../assets/tree_normal.svg';
    import iconMushroom from '../assets/mushroom_normal.svg';
    import iconLeaf from '../assets/leaf_normal.svg';

    import { tooltip } from './tooltip';
    
    function handleTreeClick() {
		uiState_setEditMode(EditMode.TREE);
	}

	function handleKaraClick() {
		uiState_setEditMode(EditMode.KARA);
	}

	function handleLeafClick() {
		uiState_setEditMode(EditMode.LEAF);
	}

	function handleMushroomClick() {
		uiState_setEditMode(EditMode.MUSHROOM);
	}


</script>

<div style=" display: flex; flex-direction: column">
    <p>Welt</p>
	<!-- <button on:click={handleKaraClick} class:highlightButton={$uiState.editMode === EditMode.KARA}>kara</button> -->
	
    <button
        title="Kara setzen"
        use:tooltip
        class="iconButton"
        class:highlightButton={$uiState.editMode === EditMode.KARA}
        on:click={handleKaraClick}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconKara} 
            alt="Icon Kara setzen"
        />
    </button>

    <button
        title="Baum setzen / löschen"
        use:tooltip
        class="iconButton"
        class:highlightButton={$uiState.editMode === EditMode.TREE}
        on:click={handleTreeClick}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconTree} 
            alt="Icon Baum setzen / löschen"
        />
    </button>

    <button
        title="Pilz setzen / löschen"
        use:tooltip
        class="iconButton"
        class:highlightButton={$uiState.editMode === EditMode.MUSHROOM}
        on:click={handleMushroomClick}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconMushroom} 
            alt="Pilz Baum setzen / löschen"
        />
    </button>

    <button
        title="Blatt setzen / löschen"
        use:tooltip
        class="iconButton"
        class:highlightButton={$uiState.editMode === EditMode.LEAF}
        on:click={handleLeafClick}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconLeaf} 
            alt="Blatt Baum setzen / löschen"
        />
    </button>
</div>

<style>
	.highlightButton {
		background-color: aqua;
	}

    .iconButton {
        margin: 0;
        padding: 3px;
    }

    img {
        margin: 0;
        padding: 0;
        border: 0;
    }
</style>