//#region variables
let allPokemonMetaData = [];
let allPokemonDetailData = [];

let PokemondatailDataChache = [];

let renderingBatchSize = 20;
let renderingSection = 0;

//#endregion
//#region Main


//#endregion
//#region Functions

async function init(){
    await getPokemonDetailData("https://pokeapi.co/api/v2/pokemon/1");
    await setAllPokemonMetaData();
    renderPokemonOverview();
    console.log(allPokemonMetaData);
    
};

function myconsole(){
    console.log(allPokemonDetailData);
};

function renderPokemonOverview(){
    for (let i = 0; i < renderingBatchSize; i++){
        document.getElementById("section_pokemon_overview").innerHTML += pokemonOverviewCardTemplate(renderingBatchSize * renderingSection + i);
    };
};

function renderSmallPokemonCardsBatch(){

};

function getPokemonName(index){
    let name = allPokemonMetaData.results[index].name;
    return name.toUpperCase();
};

async function getPokemonDetailsDataBatch(){
    try {
        let allPokemonDetailData =  await fetch(`https://pokeapi.co/api/v2/pokemon/?offset=${renderingBatchSize * renderingSection}&limit=${renderingBatchSize}`);
        let allPokemonDetailDataJSON =  await allPokemonData.json();
        allPokemonDetailData += allPokemonMetaDataJSON;
    } catch (error) {
       console.warn("HILFE ICH BIN IN GEFAHR ! DER SERVER ANTWORTET NICHT HILFE !");
    };
};

async function getPokemonDetailData(url){
    try {
        let allPokemonDetailData =  await fetch(`${url}`);
        let allPokemonDetailDataJSON =  await allPokemonData.json();
        allPokemonDetailData +=allPokemonDetailDataJSON;
    } catch (error) {
       
    };
};

async function setAllPokemonMetaData(){
    try {
        let allPokemonData =  await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10000");
        let allPokemonMetaDataJSON =  await allPokemonData.json();
        allPokemonMetaData = allPokemonMetaDataJSON;
    } catch (error) {
       console.warn("HILFE ICH BIN IN GEFAHR ! DER SERVER ANTWORTET NICHT HILFE !");
    };
};

//#region Functions