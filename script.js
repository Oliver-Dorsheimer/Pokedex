//#region variables
let allPokemonMetaData = new Array(1350).fill(null);
let allPokemonDetailData = new Array(1350).fill(null);

let renderedSearchElementsList = new Array(1350).fill(false);
let searchHitsPokemonMetaData = [];

let defaultRenderingMode = renderingModes[0];
let searchRenderingMode = renderingModes[1];
let renderingBatchSize = 20;
let renderingSection = 0;
let loadingSection = 0;
let loadingBatchSize = 4;

//#endregion

async function init(){
    
    await setAllPokemonMetaData();
    await loadPokemonDetailsDataBatch();
    loadPokemonDetailsDataBatch();
    console.log(allPokemonMetaData);
    console.log(allPokemonDetailData);
    renderPokemonOverviewBatch("normal");
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
    document.getElementById("large_pokemon_card_container").classList.remove("Dnone");
};

async function changeLargePokemonCard(index){
    await getPokemonDetailData(index);
    openLargePokemonCard(index);
};

function closeLargePokemonCard(index){
    document.getElementById("large_pokemon_card_container").classList.add("Dnone");
};

function clickProtection(event){
    event.stopPropagation();
};

//#region Search Functionality

function changeRenderModeToSearch(){
    let length = document.getElementById("header_searchbar").value.length;
    if(length < 4){
        if(!renderingModes[0].isActive){
            setRenderingModeTo("default")
            toggleElementsVisibility();
            //add dnone to all seach elements
        }
        return;
    };
    
    setRenderingModeTo("search");
};

function setRenderingModeTo(modeName){
    let modeIndex = getModeIndex(modeName);
    renderingModes[modeIndex].
    renderingModes.array.forEach(element => {
        if (element.name == modeName){
            element.isActive = true;
            toggleElementsVisibility(index)
        }else{
            element.isActive = false;
        };

    });

    if(length < 4){
        if(searchRenderingMode.isActive){
            searchRenderingMode.isActive = false;
            defaultRenderingMode.isActive = true;
            toggleNormalElementsVisibility();
            //add dnone to all seach elements
        };
        return;
    };

    searchRenderingMode.isActive = true;
    defaultRenderingMode.isActive = false;
    toggleNormalElementsVisibility();
    //set dnone to all rendered search elements that dont match any search hits
    funkyname();
    //check if search hit elemnts ist already rendered. if (rendered) unset dnone, else get detail data and render search element
    getMatchingPokemonsByName(document.getElementById("header_searchbar").value);
    console.log(searchHitsPokemonMetaData);
};

function getModeIndex(modeName){
    renderingModes.forEach(element =>{
        if (element.name == modeName){
            return index;
        };
    });
};

function toggleElementsVisibility(){
    if (defaultRenderingMode.isActive){
        document.getElementById("section_pokemon_overview").classList.remove("Dnone");
    }else{
        document.getElementById("section_pokemon_overview").classList.add("Dnone");
    };
};

function getMatchingPokemonsByName(name){
    let indexOfMatchingPokemons = [];
    let lowerCaseName = name.toLowerCase();
    for(let i = 0; i < allPokemonMetaData.results.length; i++){
        if(allPokemonMetaData.results[i].name != null && allPokemonMetaData.results[i].name.includes(lowerCaseName)){
            indexOfMatchingPokemons.push(i);
        };
    };
    searchHitsPokemonMetaData = indexOfMatchingPokemons;
};

//#endregion
//#region Overview Rendering

async function renderSearchElements(renderingMode){
    for (let i = 0; i < renderingBatchSize; i++){
        let primaryType = getPrimaryType(renderingSection * renderingBatchSize + i);
        let indexInColorDataJSON = typeColors.findIndex(typeColorData => typeColorData.type == primaryType);
        await renderOverviewCard(i, indexInColorDataJSON, renderingMode);
    };
};

async function renderPokemonOverviewBatch(renderingMode){
    try{
        for (let i = 0; i < renderingBatchSize; i++){
        let primaryType = getPrimaryType(renderingSection * renderingBatchSize + i);
        let indexInColorDataJSON = typeColors.findIndex(typeColorData => typeColorData.type == primaryType);
        await renderOverviewCard(i, indexInColorDataJSON, renderingMode);
    };
    renderingSection++
    } catch (error){
        console.warn("Error rendering Overview Batch");
    };
};

function getPrimaryType(index){
    return allPokemonDetailData[index].types[0].type.name;
};

async function renderOverviewCard(index, indexInColorDataJSON, renderingMode){
    document.getElementById("section_pokemon_overview").innerHTML += pokemonOverviewCardTemplate(renderingBatchSize * renderingSection + index, indexInColorDataJSON, renderingMode);
};

function getPokemonName(index){
    let name = allPokemonMetaData.results[index].name;
    return name.toUpperCase();
};

function loadMorePokemon(renderingMode){
    if(!isBatchLoaded() || defaultRenderingMode.isActive == false){
        return;
    };

    loadPokemonDetailsDataBatch();
    renderPokemonOverviewBatch(renderingMode);
    console.log(allPokemonDetailData);
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


/*overscroll-behaviour: contain;*/