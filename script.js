//#region variables
let allPokemonMetaData = new Array(1350).fill(null);
let allPokemonDetailData = new Array(1350).fill(null);

let PokemondatailDataChache = new Array(20).fill(null);

let renderingBatchSize = 20;
let renderingSection = 0;
let loadingSection = 0;
let loadingBatchSize = 4;

//#endregion
//#region Main


//#endregion
//#region Functions

async function init(){
    
    await setAllPokemonMetaData();
    await loadPokemonDetailsDataBatch();
    loadPokemonDetailsDataBatch();
    console.log(allPokemonMetaData);
    console.log(allPokemonDetailData);
    renderPokemonOverviewBatch();
};

function openLargePokemonCard(index){
    console.log("opening pokemon card",index);
    let getPokemonTypes = allPokemonDetailData[index];
    let primaryType = getPokemonTypes.types[0].type.name;
    let colorDataIndex = typeColors.findIndex(typeColorData => typeColorData.type == primaryType);
    document.getElementById("large_pokemon_card_container").innerHTML = pokemonLargeCardTemplate(index, colorDataIndex);
    document.getElementById("large_pokemon_card_container").classList.remove("Dnone");
};

function closeLargePokemonCard(index){
    console.log("closing pokemon card",index);
    document.getElementById("large_pokemon_card_container").classList.add("Dnone");
};

function clickProtection(event){
    event.stopPropagation();
};

function loadMorePokemon(){
    if(!isBatchLoaded()){
        return;
    };

    loadPokemonDetailsDataBatch();
    renderPokemonOverviewBatch();
    console.log(allPokemonDetailData);
};

function isBatchLoaded(){
    if(allPokemonDetailData[renderingBatchSize * loadingSection - 1] !== null){
        return true;
    };
};

//#region Rendering

async function renderPokemonOverviewBatch(){
    try{
        for (let i = 0; i < renderingBatchSize; i++){
        let getPokemonTypes = allPokemonDetailData[renderingSection * renderingBatchSize + i];
        let primaryType = getPokemonTypes.types[0].type.name;
        let colorDataIndex = typeColors.findIndex(typeColorData => typeColorData.type == primaryType);
        await renderOverviewCard(i, colorDataIndex);
    };
    renderingSection++
    } catch (error){
        console.warn("Error rendering Overview Batch");
    };
};

async function renderOverviewCard(index, colorDataIndex){
    document.getElementById("section_pokemon_overview").innerHTML += pokemonOverviewCardTemplate(renderingBatchSize * renderingSection + index, colorDataIndex);
};

function getPokemonName(index){
    let name = allPokemonMetaData.results[index].name;
    return name.toUpperCase();
};

//#endregion
//#region API Calls

async function setAllPokemonMetaData(){
    try {
        let allPokemonData =  await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10000");
        let allPokemonMetaDataJSON =  await allPokemonData.json();
        allPokemonMetaData = allPokemonMetaDataJSON;
    } catch (error) {
       console.warn("failed to load pokemon meta data");
    };
};

async function loadPokemonDetailsDataBatch(){
    try {
        let globalIndex = renderingBatchSize * loadingSection;
        let promises = new Array(renderingBatchSize).fill(null);
        for (let i = 0; i < renderingBatchSize; i++){
            promises[i] = getPokemonDetailData(globalIndex + i);
        };
        await Promise.allSettled(promises);
        loadingSection++
    } catch (error) {
       console.warn("failed to load pokemon detail data batch");
    };
};

async function getPokemonDetailData(index){
    try {
        if(allPokemonDetailData[index] !== null){
            console.log("dedupe worked !");
            return
        };
        
        let allPokemonDetails =  await fetch(allPokemonMetaData.results[index].url);
        let allPokemonDetailDataJSON =  await allPokemonDetails.json();
        allPokemonDetailData[index] = allPokemonDetailDataJSON;
        
    } catch (error) {
       console.warn("error loading pokemon detail data");
    };
};

//#endregion
//#endregion


/*overscroll-behaviour: contain;
try {
        let globalIndex = renderingBatchSize * renderingSection;
        let promises = [];
        for (let i = 0; i < renderingBatchSize/loadingBatchSize; i++){
            await Promise.allSettled([getPokemonDetailData(globalIndex), getPokemonDetailData(globalIndex + 1), getPokemonDetailData(globalIndex + 2), getPokemonDetailData(globalIndex + 3)]);
            globalIndex = globalIndex + loadingBatchSize;
        };
        if(renderingBatchSize%loadingBatchSize >= 0){
            for (let i = 0; i < renderingBatchSize/loadingBatchSize; i++){
            const globalIndex = renderingBatchSize * renderingSection + i;
            await getPokemonDetailData(globalIndex);
            };
        };
        loadingSection++
    } catch (error) {
       console.warn("Pokemon Datails Data could not be loaded !");
    };
*/