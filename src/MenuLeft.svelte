<script lang="ts">
    import {dialog_openChangeSizeDialog, dialog_openMessageDialog, kara_move, kara_putLeaf, kara_removeLeaf, kara_turnLeft, kara_turnRight } from './actions';
    import { tooltip } from './tooltip';

    // https://joshuatz.com/posts/2021/using-svg-files-in-svelte/
    import iconMove from '../assets/iconMove_normal.svg';
    import iconTurnLeft from '../assets/iconTurnLeft_normal.svg';
    import iconTurnRight from '../assets/iconTurnRight_normal.svg';
    import iconPutLeaf from '../assets/iconPutLeaf_normal.svg';
    import iconRemoveLeaf from '../assets/iconRemoveLeaf_normal.svg';
    import iconSetSize from '../assets/iconSetSize_nromal.svg';

    function handleKaraMoveClick() {
        const result = kara_move();
        if (result) {
            // Es ist ein Fehler aufgetreten
            dialog_openMessageDialog('Fehler', result.message);
        }
    }

    function handlePutLeafClick() {
        const result = kara_putLeaf();
        if (result) {
            dialog_openMessageDialog('Fehler', result.message);
        }
    }

    function handleRemoveLeafClick() {
        const result = kara_removeLeaf();
        if (result) {
            dialog_openMessageDialog('Fehler', result.message);
        }
    }

    function handleChangeSizeClick() {
        dialog_openChangeSizeDialog();
    }
</script>

<div style=" display: flex; flex-direction: column; padding: 0.5em">
    <p>Kara</p>

    <button
        title="Schritt vor"
        use:tooltip
        class="iconButton"
        on:click={handleKaraMoveClick}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconMove} 
            alt="Icon Schritt vor"
        />
    </button>
    
    <button
        title="nach links drehen"
        use:tooltip
        class="iconButton"
        on:click={kara_turnLeft}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconTurnLeft} 
            alt="Icon nach links drehen"
        />
    </button>
    
    <button
        title="nach rechts drehen"
        use:tooltip
        class="iconButton"
        on:click={kara_turnRight}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconTurnRight} 
            alt="Icon nach rechts drehen"
        />
    </button>
    
    <button
        title="Blatt legen"
        use:tooltip
        class="iconButton"
        on:click={handlePutLeafClick}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconPutLeaf} 
            alt="Icon Blatt legen"
        />
    </button>
    
    <button
        title="Blatt entfernen"
        use:tooltip
        class="iconButton"
        on:click={handleRemoveLeafClick}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconRemoveLeaf} 
            alt="Icon Blatt aufnehmen"
        />
    </button>

    <div style="height: 2em"></div>

    <button
        title="Grösse der Welt ändern"
        use:tooltip
        class="iconButton"
        on:click={handleChangeSizeClick}
    >
        <img
            style="pointer-events: none;"
            height="30px"
            src={iconSetSize} 
            alt="Icon Grösse der Welt ändernr"
        />
    </button>

</div>