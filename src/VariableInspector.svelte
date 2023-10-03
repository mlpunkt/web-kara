<script lang="ts">
    import { variables } from './stores';
</script>

<div style="height: 30%; overflow-y: scroll;">
    <div>Variablen</div>
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
                <td>{variable.value}</td>
                <td>{variable.type}</td>
            </tr>
        {/each}
    </table>
    {/each}
</div>