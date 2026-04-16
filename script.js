//#region variables
let allPokemonMetaData = new Array(1350).fill(null);
let allPokemonDetailData = new Array(1350).fill(null);
let renderedElementsList = new Array(1350).fill(false);
let renderingBatchSize = 20;
let loadingSection = 0;
let loadingBatchSize = 4;

let searchHitsPokemonMetaData = [];

//#endregion

async function init(){
    await setAllPokemonMetaData();
    await loadPokemonDetailsDataBatch();
    await renderBySections();
    cacheNextElements();
    showNextSection();
};

async function cacheNextElements(){
    await loadPokemonDetailsDataBatch();
    renderBySections();
};

function openLargePokemonCard(index){
    if (index < 0){
        return;
    };
    if(index >= allPokemonMetaData.length){
        return;
    };
    
    let indexInColorDataJSON = typeColors.findIndex(typeColorData => typeColorData.type == getPrimaryPokemonType(index));
    document.getElementById("large_pokemon_card_container").innerHTML = pokemonLargeCardTemplate(index, indexInColorDataJSON);
    document.getElementById("large_pokemon_card_container").classList.remove("bigDnone");
};

function getPrimaryPokemonType(index){
    let primaryType = allPokemonDetailData[index].types[0].type.name;
    return primaryType;
};

async function changeLargePokemonCard(index, mod){
    let currentRenderingMode = getCurrentRenderingModeData().name;
    if(currentRenderingMode == "default"){
        await getPokemonDetailData(index);
        openLargePokemonCard(index + mod);
    }else if(currentRenderingMode == "search"){
        let nextPokemonInSearchArray = findIndexInSearchArray(index) + mod;
        if(searchHitsPokemonMetaData[nextPokemonInSearchArray] != undefined || null){
            openLargePokemonCard(searchHitsPokemonMetaData[nextPokemonInSearchArray]);
        };
    };
};

function findIndexInSearchArray(index){
    for(let i = 0; i < searchHitsPokemonMetaData.length; i++){
            if(searchHitsPokemonMetaData[i] === index){
                return i;
            };
        };
};

function closeLargePokemonCard(index){
    document.getElementById("large_pokemon_card_container").classList.add("bigDnone");
};

function clickProtection(event){
    event.stopPropagation();
};

//#region Search Functionality

async function checkIsSearchUsed(){
    let length = document.getElementById("header_searchbar").value.length;
    if(length < 3){
        if(renderingModesData[1].isActive){
            setRenderingModeTo("default");
            hideAllRenderedElements();
            showAllSections();
            document.getElementById("pokemon_overview_button_load_more").classList.remove("bigDnone");
        };
        return;
    };
    hideAllRenderedElements();
    document.getElementById("pokemon_overview_button_load_more").classList.add("bigDnone");
    setRenderingModeTo("search");
    getMatchingPokemonsByName(document.getElementById("header_searchbar").value);
    renderIndividualElementsByIndexArray(searchHitsPokemonMetaData);
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
    console.log(searchHitsPokemonMetaData);
};

//#endregion
//#region Overview Rendering
function showAllSections(){
    let currentRenderingMode = getCurrentRenderingModeData();
    for(let i = 0; i < (currentRenderingMode.renderingSection - 1) * renderingBatchSize; i++){
        document.getElementById(`article_overview_card_${currentRenderingMode.HTMLMark + "_" + i}`).classList.remove("bigDnone");
    };
};

function showNextSection(){
    let currentRenderingMode = getCurrentRenderingModeData();
    for(let i = 0; i < currentRenderingMode.renderingSection * renderingBatchSize; i++){
        document.getElementById(`article_overview_card_${currentRenderingMode.HTMLMark + "_" + i}`).classList.remove("bigDnone");
    };
};

function setRenderingModeTo(modeName){
    renderingModesData.forEach(modeElement => {
        if(modeElement.name == modeName){
            modeElement.isActive = true;
        }else{
            modeElement.isActive = false;
        };
    });
};

function showAllRenderedElements(){
    for(let i = 0; i < renderedElementsList.length; i++){
        if(renderedElementsList[i] == true){
            let currentRenderingModeData = getCurrentRenderingModeData();
            document.getElementById(`article_overview_card_${currentRenderingModeData.HTMLMark + "_" + i}`).classList.remove("bigDnone");
        };
    };
};

function hideAllRenderedElements(){
    for(let i = 0; i < renderedElementsList.length; i++){
        if(renderedElementsList[i] == true){
            let currentRenderingModeData = getCurrentRenderingModeData();
            document.getElementById(`article_overview_card_${currentRenderingModeData.HTMLMark + "_" + i}`).classList.add("bigDnone");
        };
    };
};

function hidePokemonCard(index){
    let currentRenderingModeData = getCurrentRenderingModeData();
    document.getElementById(`article_overview_card_${currentRenderingModeData.HTMLMark + "_" + index}`).classList.add("bigDnone");
};

async function renderIndividualElementsByIndexArray(array){
    let currentRenderingModeData = getCurrentRenderingModeData();
    for (let i = 0; i < array.length; i++){
        if(renderedElementsList[array[i]] == true){
            document.getElementById(`article_overview_card_${currentRenderingModeData.HTMLMark + "_" + array[i]}`).classList.remove("bigDnone");
        }else{
            await getPokemonDetailData(array[i]);

            let primaryType = getPrimaryType(currentRenderingModeData.renderingSection * renderingBatchSize + array[i]);
            let indexInColorDataJSON = typeColors.findIndex(typeColorData => typeColorData.type == primaryType);
            await renderOverviewCard(currentRenderingModeData.HTMLSectionElementID, array[i], indexInColorDataJSON, currentRenderingModeData.HTMLMark);
            renderedElementsList[array[i]] = true;
            document.getElementById(`article_overview_card_${currentRenderingModeData.HTMLMark + "_" + array[i]}`).classList.remove("bigDnone");
        };
    };
};

async function renderBySections(){
    try{
        let currentRenderingMode = getCurrentRenderingModeData();
        for (let i = 0; i < renderingBatchSize; i++){
        let primaryType = getPrimaryType(currentRenderingMode.renderingSection * renderingBatchSize + i);
        let indexInColorDataJSON = typeColors.findIndex(typeColorData => typeColorData.type == primaryType);
        await renderOverviewCard(currentRenderingMode.HTMLSectionElementID, renderingBatchSize * currentRenderingMode.renderingSection + i, indexInColorDataJSON, currentRenderingMode.HTMLMark);
        renderedElementsList[currentRenderingMode.renderingSection * renderingBatchSize + i] = true;
    };
    currentRenderingMode.renderingSection++;
    } catch (error){
        console.warn("Error rendering Section Batch");
        return;
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

async function renderOverviewCard(HTMLSectionElementID, index, indexInColorDataJSON, currentRenderingModeName){
    document.getElementById(HTMLSectionElementID).innerHTML += pokemonOverviewCardTemplate(index, indexInColorDataJSON, currentRenderingModeName);
};

function getPokemonName(index){
    let name = allPokemonMetaData[index].name;
    return name.toUpperCase();
};

async function loadMorePokemon(){
    let currentRenderingMode = getCurrentRenderingModeData().name;
    if(!isBatchLoaded()){
        console.log("API calls Lagging Behind !")
        await cacheNextElements();
        return;
    };
    if(!isSectionRendered()){
        console.log("Rendering Lagging Behind !")
        await cacheNextElements();
        return;
    };

    cacheNextElements();
    showNextSection();
    console.log(allPokemonDetailData);
    console.log(renderedElementsList);
};

function isSectionRendered(){
    let currentRenderingModeData = getCurrentRenderingModeData();
    if(document.getElementById(`article_overview_card_${currentRenderingModeData.HTMLMark + "_" + renderingBatchSize * currentRenderingModeData.renderingSection}`)){
        return false;
    }else{
        return true;
    };
};

function isBatchLoaded(){
    let currentRenderingSection = getCurrentRenderingModeData().renderingSection;
    if(allPokemonDetailData[renderingBatchSize * currentRenderingSection - 1] == null || allPokemonDetailData[renderingBatchSize * currentRenderingSection - 1] == undefined){
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