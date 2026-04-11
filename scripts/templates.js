function pokemonOverviewCardTemplate(index, indexInColorDataJSON, renderingMode){
    return `<article id = "article_overview_card_${index + "_" + renderingMode} " class = "article_overview_card" style = "
        background-color: var(${typeColors[indexInColorDataJSON].primary});
        border-color: var(${typeColors[indexInColorDataJSON].accent});
        ">
        <div class = "overview_card_image_container" style = "
            background-color: var(${typeColors[indexInColorDataJSON].tint});
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

function pokemonLargeCardTemplate(index, indexInColorDataJSON){
    return `<article id = "large_pokemon_card" onclick = "clickProtection(event)">
        <button id = "large_pokemon_card_previous_button" onclick = "changeLargePokemonCard(${index-1})">previous</button>
        <div class = "large_pokemon_card_image_container" style = "
            background-color: var(${typeColors[indexInColorDataJSON].tint});
            ">
            <img class = "overview_card_image" src = "${allPokemonDetailData[index].sprites.other['official-artwork'].front_default}">
        </div>
        <section class = "large_pokemon_card_header" onclick = "clickProtection(event)" style = "
        background-color: var(${typeColors[indexInColorDataJSON].primary});
        border-color: var(${typeColors[indexInColorDataJSON].accent});
        ">
            
        </section>
        <section class = "large_pokemon_card_main" onclick = "clickProtection(event)">
            <section class = "large_pokemon_card_main_top_content">
                <p>ID:${allPokemonDetailData[index].id}</p>
                <h3>${getPokemonName(index)}</h3>
                <button class = "large_pokemon_card_close_button" onclick = "closeLargePokemonCard()">X</button>
            </section>
            <section class = "large_pokemon_card_main_middle_content">
                <div class = "large_pokemon_card_divide"></div>
                <div class = "large_pokemon_card_main_middle_top_info">
                    <p>Height: ${allPokemonDetailData[index].stats[0].base_stat}</p>
                    <p>Weight: ${allPokemonDetailData[index].weight}</p>
                </div>
                <div  class = "large_pokemon_card_main_middle_middle_info">
                    <div>
                        <p>HP: ${allPokemonDetailData[index].stats[0].base_stat}</p>
                        <p>Attack: ${allPokemonDetailData[index].stats[1].base_stat}</p>
                        <p>Defense: ${allPokemonDetailData[index].stats[2].base_stat}</p>
                    </div>
                    <div>
                        <p>Speed: ${allPokemonDetailData[index].stats[5].base_stat}</p>
                        <p>Special Attack: ${allPokemonDetailData[index].stats[3].base_stat}</p>
                        <p>Special Defense: ${allPokemonDetailData[index].stats[4].base_stat}</p>
                    </div>
                </div>
                <div class = "large_pokemon_card_divide"></div>
            </section>
        </section>
        <button id = "large_pokemon_card_next_button" onclick = "changeLargePokemonCard(${index+1})">next</button>
    </article>
`};