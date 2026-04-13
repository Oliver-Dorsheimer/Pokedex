//#region variables
let allPokemonMetaData = new Array(1350).fill(null);
let allPokemonDetailData = new Array(1350).fill(null);
let renderedSectionElementsList = new Array(1350).fill(false);
let renderingBatchSize = 20;
let loadingSection = 0;
let loadingBatchSize = 4;

let renderedSearchElementsList = new Array(1350).fill(false);
let searchHitsPokemonMetaData = [];

//#endregion

async function init(){
    
    await setAllPokemonMetaData();
    await loadPokemonDetailsDataBatch();
    loadPokemonDetailsDataBatch();
    console.log(allPokemonMetaData);
    console.log(allPokemonDetailData);
    console.log(getCurrentRenderingModeData())
    renderBySections("default");
    console.log(renderedSectionElementsList);
};

function openLargePokemonCard(index){
    if (index < 0){
        return;
    };
    if (index > allPokemonMetaData.length){
        return;
    };

    let getPokemonTypes = allPokemonDetailData[index];
    let primaryType = getPokemonTypes.types[0].type.name;
    let indexInColorDataJSON = typeColors.findIndex(typeColorData => typeColorData.type == primaryType);
    document.getElementById("large_pokemon_card_container").innerHTML = pokemonLargeCardTemplate(index, indexInColorDataJSON);
    document.getElementById("large_pokemon_card_container").classList.remove("bigDnone");
};

async function changeLargePokemonCard(index){
    await getPokemonDetailData(index);
    openLargePokemonCard(index);
};

function closeLargePokemonCard(index){
    document.getElementById("large_pokemon_card_container").classList.add("bigDnone");
};

function clickProtection(event){
    event.stopPropagation();
};

//#region Search Functionality

function checkIsSearchUsed(){
    let length = document.getElementById("header_searchbar").value.length;
    if(length < 4){
        if(renderingModesData[1].isActive){
            setRenderingModeTo("default");
            //add dnone to all seach elements
        };
        return;
    };
    setRenderingModeTo("search");
};

function setRenderingModeTo(modeName){
    renderingModesData.forEach(modeElement => {
        if(modeElement.name == modeName){
            modeElement.isActive = true;
        }else{
            modeElement.isActive = false;
        };
    });
    refreshSectionVisibility();
};

function refreshSectionVisibility(){
    renderingModesData.forEach(modeElement => {
        if(modeElement.isActive == true){
            document.getElementById(modeElement.HTMLSectionElementID).classList.remove("bigDnone");
        }else {
            document.getElementById(modeElement.HTMLSectionElementID).classList.add("bigDnone");
        };
    })
};

function getMatchingPokemonsByName(name){
    let indexOfMatchingPokemons = [];
    let lowerCaseName = name.toLowerCase();
    for(let i = 0; i < allPokemonMetaData.length; i++){
        if(allPokemonMetaData[i].name != null && allPokemonMetaData[i].name.includes(lowerCaseName)){
            indexOfMatchingPokemons.push(i);
        };
    };
    searchHitsPokemonMetaData = indexOfMatchingPokemons;
};

//#endregion
//#region Overview Rendering
function showNextSection(){
    let currentRenderingMode = getCurrentRenderingModeData();
    for(let i = 0; i < currentRenderingMode.renderingSection * renderingBatchSize + i; i++){
        document.getElementById(`article_overview_card_${currentRenderingMode.HTMLMark + "_" + i}`).classList.remove("bigDnone");
    };
};

function selectRenderingFunction(){
    getCurrentRenderingModeData().name
};

async function renderIndividualElements(renderingMode){
    for (let i = 0; i < renderingBatchSize; i++){
        let primaryType = getPrimaryType(renderingSection * renderingBatchSize + i);
        let indexInColorDataJSON = typeColors.findIndex(typeColorData => typeColorData.type == primaryType);
        await renderOverviewCard(i, indexInColorDataJSON, renderingMode);
    };
};

async function renderBySections(){
    try{
        let currentRenderingMode = getCurrentRenderingModeData();
        for (let i = 0; i < renderingBatchSize; i++){
        let primaryType = getPrimaryType(currentRenderingMode.renderingSection * renderingBatchSize + i);
        let indexInColorDataJSON = typeColors.findIndex(typeColorData => typeColorData.type == primaryType);
        await renderOverviewCard(i, indexInColorDataJSON, currentRenderingMode.HTMLSectionElementID, currentRenderingMode.renderingSection, currentRenderingMode.HTMLMark);
        renderedSectionElementsList[currentRenderingMode.renderingSection * renderingBatchSize + i] = true;
    };
    currentRenderingMode.renderingSection++
    } catch (error){
        console.warn("Error rendering Section Batch");
    };
};

function getCurrentRenderingModeData(){
    for(let i = 0; i < renderingModesData.length; i++){
        if(renderingModesData[i].isActive){
            return renderingModesData[i];
        };
    };
};

function getPrimaryType(index){
    return allPokemonDetailData[index].types[0].type.name;
};

async function renderOverviewCard(index, indexInColorDataJSON, HTMLSectionElementID, currentRenderingSection, currentRenderingModeName){
    document.getElementById(HTMLSectionElementID).innerHTML += pokemonOverviewCardTemplate(renderingBatchSize * currentRenderingSection + index, indexInColorDataJSON, currentRenderingModeName);
};

function getPokemonName(index){
    let name = allPokemonMetaData[index].name;
    return name.toUpperCase();
};

function loadMorePokemon(){
    let currentRenderingMode = getCurrentRenderingModeData().name;
    if(!isBatchLoaded()){
        return;
    };

    loadPokemonDetailsDataBatch();
    renderBySections();
    console.log(allPokemonDetailData);
    console.log(renderedSectionElementsList);
};

function isBatchLoaded(){
    if(allPokemonDetailData[renderingBatchSize * loadingSection - 1] == null || allPokemonDetailData[renderingBatchSize * loadingSection - 1] == undefined){
        return false;
    }else{
        return true;
    };
};

//#endregion
//#region API Calls

async function setAllPokemonMetaData(){
    try {
        let allPokemonData =  await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10000");
        let allPokemonMetaDataJSON =  await allPokemonData.json();
        allPokemonMetaData = allPokemonMetaDataJSON.results;
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
        
        let allPokemonDetails =  await fetch(allPokemonMetaData[index].url);
        let allPokemonDetailDataJSON =  await allPokemonDetails.json();
        allPokemonDetailData[index] = allPokemonDetailDataJSON;
        
    } catch (error) {
       console.warn("error loading pokemon detail data");
    };
};

//#endregion


/*overscroll-behaviour: contain;*/