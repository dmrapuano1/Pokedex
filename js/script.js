//fix for linters on my Brackets. Must be commented out for code to run properly
//{
//    "parserOptions": {
//        "ecmaVersion": 6,
//        "sourceType": "module",
//        "ecmaFeatures": {
//            "jsx": true
//        }
//    },
//    "rules": {
//        "semi": "error"
//    }
//}

var myApplication = (function () {

    var toggleDisplay = function (power) {
        var $loadingImg = $('.loading-image');
        if (power === 'off') {
            $loadingImg.hide();
        } else if (power === 'on') {
            $loadingImg.show();
        };
    };

    toggleDisplay('on');
    var pokemonRepository = (function () { //Start of repository IIFE
        // The location all pokemon will be listed in
        var repository = [];
        // URL for API pokemon come from
        var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151'; //total number availible is 649

        function add(pokemon) {
            // Adding new pokemon element to the respoitory
            repository.push(pokemon);
        };

        function getAll() {
            return repository;
        }

        function loadList() {
            // Adds loading img
            toggleDisplay('on');

            return $.ajax(apiUrl, {
                dataType: 'json'
            }).then(function (json) {
                json.results.forEach(function (item) {
                    var pokemon = {
                        name: item.name,
                        detailsUrl: item.url,
                    };
                    add(pokemon);
                });
                toggleDisplay('off');
            }).catch(function (e) {
                // Error catch to determine issue
                console.error(e);
            });
        };

        function loadDetails(pokemon) {
            toggleDisplay('on');
            var url = pokemon.detailsUrl;
            // Pulls details for pokemon from API
            return $.ajax(url, {
                dataType: 'json'
            }).then(function (details) {
                // Adds the details to the item
                pokemon.imageUrl = details.sprites.front_default;
                pokemon.height = details.height;
                pokemon.id = details.id;
                // Pulls types in array through function
                pokemon.types = typesToArray(details.types);
                pokemon.abilities = typesToArray(details.abilities);
                toggleDisplay('off');
            }).catch(function (e) {
                console.error(e);
            });
        };


        var typesToArray = function (details) {
            // Pulls the portion of code that has the types as an array of objects
            var typeArray = details;
            var portionArray = [];
            // Loops through to pull type from object out of each point in array
            for (i = 0; i < typeArray.length; i++) {
                switch (true) {
                    //separates type and ability as well as allows for more if needed by using switch
                    case typeArray[i].type !== undefined:
                        var currentType = typeArray[i].type.name;
                        // Pushes type into array
                        portionArray.push(currentType);
                        break;
                    case typeArray[i].ability !== undefined:
                        var currentType = typeArray[i].ability.name;
                        portionArray.push(currentType);
                        break;
                };
            };
            // Returns array for use elsewhere
            return portionArray;
        };
        // Allows other IIFEs to access specific functions
        return {
            getAll: getAll,
            loadList: loadList,
            loadDetails: loadDetails,
        };
    })();

    var createPokemon = (function () { //Start of create Pokemon IIFE
        var addListItem = function (pokemon) {
            var $itemButton = $(`<div class="col-md-4 form-group">
                                    <div class="sr-only">Open information about pokemon: ${pokemon.name}</div>
                                    <button type="button" class="btn btn-success btn-lg btn-block" data-toggle="modal" data-target="#modal-container">${pokemon.name}</button>
                                </div>`);
            eventFunction($itemButton, pokemon);
            $('.pokemon-list').append($itemButton);
        };
        
        var eventFunction = function (button, pokemon) {
            // Creates functionality for clicking the button
            button.click(function (event) {
                if (event.target.parentNode.previousSibling !== null) {
                    var previous = event.target.parentNode.previousSibling.childNodes[3].innerHTML;
                };
                if (event.target.parentNode.nextSibling !== null) {
                    var next = event.target.parentNode.nextSibling.childNodes[3].innerHTML;
                };
                showDetails(pokemon, previous, next);
            });
        };

        function showDetails(item, previous, next) {
            // Loads the API for pokemon details on click instead of on load
            pokemonRepository.loadDetails(item).then(function () {
                var types = listToString(item.types);
                var abilities = listToString(item.abilities);
                showModal(item.name, item.height, types, abilities, item.imageUrl, item.id);
                // Runs only if direct button is pushed. 'modalButtons' is activated elsewhere if pushed from  a modal button
                modalButtons(previous, next);
                return false;
            });
        };

        // Turns array into easy to read string for pop-up
        function listToString(item) {
            var properties;
            for (i = 0; i < item.length; i++) {
                // Sets visible content to first array item
                if (properties === undefined) {
                    properties = item[i];
                } else {
                    // Adds additional items in array below subsequent items
                    properties += `<br>${item[i]}`;
                };
            };
            // returns list for use
            return properties;
        };

        function showModal(title, heightText, typesText, abilityText, picture, id) {
            // Defining where modal belongs
            var $modalContainer = $('#modal-container');
            // Empties modal of all previous content
            $modalContainer.empty();
            // Creating modal
            $modalContainer.append(`<div class="modal-dialog" role="document">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h4 class="modal-title" id="exampleModalLabel">${title} (${id})</h4>
                                                <button type="button" class="btn btn-link" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">Close</span>
                                                </button>
                                            </div>
                                            <div class="modal-body">
                                                <img src= ${picture} class="pokemon-picture">
                                                <h5>height (dm):</h5>
                                                <p class="modalText-p">${heightText}</p>
                                                <h5>types:</h5>
                                                <p class="modalText-p">${typesText}</p>
                                                <h5>abilities:</h5>
                                                <p class="modalText-p">${abilityText}</p>
                                            </div>
                                            <div class="modal-footer">
                                            </div>
                                        </div>
                                    </div>`)
            // Adding event listener for clicking outside of the modal text-area
            activePokemon = title;
            return activePokemon;
        };

        function modalButtons(previousPokemon, nextPokemon) {
            console.log(previousPokemon);
            console.log(nextPokemon);
            // We want to add a confirm and cancel button to the modal
            var $modal = $('.modal-footer');

            if (previousPokemon === undefined) {
                previousPokemon = 'mew'
            }
            var $previousButton = $(`<div class="sr-only">Open information about the previous pokemon</div>
                                        <button type="button" class="btn btn-secondary mr-auto">Previous</button>`);
            $previousButton.click(function () {
                findCorrectPokemon(previousPokemon);
            });
            $modal.append($previousButton);

            if (nextPokemon === undefined) {
                nextPokemon = 'bulbasaur'
            }
            var $nextButton = $(`<div class="sr-only">Open information about the next pokemon</div>
                                    <button type="button" class="btn btn-primary">Next</button>`)
            $nextButton.click(function () {
                findCorrectPokemon(nextPokemon);
            });
            $modal.append($nextButton);
            $nextButton.focus();
        };


        function findCorrectPokemon(targetPokemon) {
            var previousPokemon, nextPokemon, correctPokemon, pokemonFound;
            pokemonRepository.getAll().forEach(function (pokemon) {
                if (pokemonFound === true) {
                    nextPokemon = pokemon.name;
                    showDetails(correctPokemon, previousPokemon, nextPokemon);
                    pokemonFound = false;
                } else if (pokemon.name === targetPokemon) {
                    pokemonFound = true
                    correctPokemon = pokemon;
                    if (pokemon.id = 151) {
                        showDetails(correctPokemon, previousPokemon, 'bulbasaur');
                    };
                } else {
                    previousPokemon = pokemon.name;
                };
            });
        };

        function arrowFunction(direction) {
            var previousPokemon, nextPokemon, correctPokemon, pokemonFound;
            pokemonFound = false;
            previousPokemon = 'mew';
            pokemonRepository.getAll().forEach(function (pokemon) {
                switch (true) {
                    case pokemonFound === true:
                        nextPokemon = pokemon.name;
                        pokemonFound = false;
                        direction === 'next' ? findCorrectPokemon(nextPokemon) : findCorrectPokemon(previousPokemon);
                        break;
                    case pokemon.name === activePokemon:
                        pokemonFound = true
                        if (pokemon.id === 151) {
                            nextPokemon = 'bulbasaur';
                            direction === 'next' ? findCorrectPokemon(nextPokemon) : findCorrectPokemon(previousPokemon);
                        };
                        break;
                    default:
                        previousPokemon = pokemon.name;
                        break;
                };
            });
        };

        function modalMove(event) {
            switch (true) {
                case event.key === 'ArrowRight':
                    var target = arrowFunction('next');
                    break;
                case event.key === 'ArrowLeft':
                    var target = arrowFunction('previous');
                    break;
            };
        }

        return {
            add: addListItem,
            move: modalMove,
        };

    })();
    //Start of 'global' IIFE funtionality
    $(document).keyup(function (event) {
        var $modalContainer = $('#modal-container');
            createPokemon.move(event);
    });
    // Runs API load for data
    pokemonRepository.loadList().then(function () {
        pokemonRepository.getAll().forEach(function (pokemon) {
            // Runs the list of functions to create button list for pokemon
            createPokemon.add(pokemon);
            return false;
        });
    });
    toggleDisplay('off');
})();
