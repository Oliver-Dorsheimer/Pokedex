function pokemonOverviewCardTemplate(index){
    return `<article id = "article_overview_card">
    <div class = "overview_card_image_container">
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