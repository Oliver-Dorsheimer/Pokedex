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
    await getPokemonDetailsDataBatch();
    console.log(allPokemonMetaData);
    console.log(allPokemonDetailData);
    renderPokemonOverview();
};

//#region Rendering types[0].type.name

function renderPokemonOverview(){
    for (let i = 0; i < renderingBatchSize; i++){
        let getPokemonTypes = allPokemonDetailData[renderingSection * renderingBatchSize + i];
        let primaryType = getPokemonTypes.types[0].type.name;
        let colorDataIndex = typeColors.findIndex(typeColorData => typeColorData.type == primaryType);
        
        if (!getPokemonTypes?.types?.[1]){
            
            
        };
        document.getElementById("section_pokemon_overview").innerHTML += pokemonOverviewCardTemplate(renderingBatchSize * renderingSection + i, colorDataIndex);
    };
};

function renderSmallPokemonCardsBatch(){
    
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
       console.warn("HILFE ICH BIN IN GEFAHR ! DER SERVER ANTWORTET NICHT HILFE !");
    };
};

async function getPokemonDetailsDataBatch(){
    try {
        let globalIndex = renderingBatchSize * renderingSection;
        let promises = [];
        for (let i = 0; i < renderingBatchSize; i++){
            promises.push(getPokemonDetailData(globalIndex + i));
        };
        await Promise.allSettled(promises);
        loadingSection++
    } catch (error) {
       console.warn("Pokemon Datails Data could not be loaded !");
    };
};

async function getPokemonDetailData(index){
    try {
        let allPokemonDetails =  await fetch(allPokemonMetaData.results[index].url);
        let allPokemonDetailDataJSON =  await allPokemonDetails.json();
        allPokemonDetailData[index] = allPokemonDetailDataJSON;
    } catch (error) {
       
    };
};

//#endregion
//#endregion


/*document.getElementById(`article_overview_card${index}`).setAttribute("style", );
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