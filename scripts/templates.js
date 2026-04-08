function pokemonOverviewCardTemplate(index, colorDataIndex){
    return `<article id = "article_overview_card" style = "
        background-color: var(${typeColors[colorDataIndex].primary});
        border-color: var(${typeColors[colorDataIndex].accent});
        ">
        <div class = "overview_card_image_container" style = "
            background-color: var(${typeColors[colorDataIndex].tint});
            ">
            <img class = "overview_card_image" src = "${allPokemonDetailData[index].sprites.other['official-artwork'].front_default}">
        </div>
        <section class = "overview_card_content_container" onclick = "openLargePokemonCard(${index})">
            <div class = "overview_card_head_info">
            <p>ID:${allPokemonDetailData[index].id}</p>
            <p>Element</p>
            </div>
            <h2>${getPokemonName(index)}</h2>
        </section>
    </article>
`};

function pokemonLargeCardTemplate(index, colorDataIndex){
    return `<article id = "large_pokemon_card" onclick = "clickProtection(event)">
        <section class = "large_pokemon_card_header" onclick = "clickProtection(event)">
            <div class = "large_pokemon_card_image_container_top">

            </div>
            <div class = "large_pokemon_card_image_container" style = "
                background-color: var(${typeColors[colorDataIndex].tint});
                ">
                <img class = "overview_card_image" src = "${allPokemonDetailData[index].sprites.other['official-artwork'].front_default}">
            </div>
        </section>
        <section class = "large_pokemon_card_main" onclick = "clickProtection(event)" style = "
        background-color: var(${typeColors[colorDataIndex].primary});
        border-color: var(${typeColors[colorDataIndex].accent});
        ">
            
        </section>
    </article>
`};