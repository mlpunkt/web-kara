<script lang="ts">
    import { variables } from './stores';
</script>

<div style="height: 30%; overflow-y: scroll;">
    <div style="font-weight: 900;">Variablen</div>
    {#each $variables as dict}
    <table>
        <tr>
            <th>Name</th>
            <th>Wert</th>
            <th>Typ</th>
        </tr>
        {#each dict as variable}
            <tr>
                <td>{variable.name}</td>
                <td>{(variable.value !== undefined && variable.value !== null) ? variable.value : ''}</td>
                <td>{variable.type}</td>
            </tr>
        {/each}
    </table>
    {/each}
</div>

<style>
    table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
    }
</style>