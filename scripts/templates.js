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
    <div class = "overview_card_head_info">
    <p>ID:${allPokemonDetailData[index].id}</p>
    <p>Element</p>
    </div>
    <h2>${getPokemonName(index)}</h2>

    </article>
`};

/**/