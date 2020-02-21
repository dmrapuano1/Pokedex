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
            return fetch(url).then(function (response) {
                return response.json();
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
            var $itemButton = $(`<li><button class="item-button">${pokemon.name}</button></li>`);
            eventFunction($itemButton, pokemon);
            $('.pokemon-list').append($itemButton);
        };
        var eventFunction = function (button, pokemon) {
            // Creates functionality for clicking the button
            button.click(function (event) {
                if (event.target.parentNode.previousSibling !== null) {
                    var previous = event.target.parentNode.previousSibling.childNodes[0].innerHTML;
                };
                if (event.target.parentNode.nextSibling !== null) {
                    var next = event.target.parentNode.nextSibling.childNodes[0].innerHTML;
                };
                showDetails(pokemon, previous, next);
            });
        };

        function showDetails(item, previous, next) {
            // Loads the API for pokemon details on click instead of on load
            pokemonRepository.loadDetails(item).then(function () {
                var types = cleanListLook(item.types);
                var abilities = cleanListLook(item.abilities);
                showModal(item.name, item.height, types, abilities, item.imageUrl, item.id);
                // Runs only if direct button is pushed. 'modalButtons' is activated elsewhere if pushed from  a modal button
                modalButtons(previous, next);
                return false;
            });
        };

        // Turns array into easy to read string for pop-up
        function cleanListLook(item) {
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
            var $modal = $(`<div class="modal">
                                <button class="modal-close">Close</button>
                                <h1>${title} (${id})</h1>
                                <img src= ${picture} class="pokemon-picture">
                                <h2>height (dm):</h2>
                                <p class="modalText-p">${heightText}</p>
                                <h2>types:</h2>
                                <p class="modalText-p">${typesText}</p>
                                <h2>abilities:</h2>
                                <p class="modalText-p">${abilityText}</p>
                            </div>`);
            // Appending modal to modal-container
            $modalContainer.append($modal);
            // Adding event listener for clicking outside of the modal text-area
            modalEvents();
            activePokemon = title;
            return activePokemon;
        };

        function modalButtons(previousPokemon, nextPokemon) {
            // We want to add a confirm and cancel button to the modal
            var modal = document.querySelector('.modal');

            if (previousPokemon !== undefined) {
                var previousButton = document.createElement('button');
                previousButton.classList.add('modal-previous');
                previousButton.innerText = 'Previous';
                previousButton.addEventListener('click', function () {
                    hideModal();
                    findCorrectPokemon(previousPokemon);
                });
                modal.appendChild(previousButton);
            };

            if (nextPokemon !== undefined) {
                var nextButton = document.createElement('button');
                nextButton.classList.add('modal-next');
                nextButton.innerText = 'Next';
                nextButton.addEventListener('click', function () {
                    hideModal();
                    findCorrectPokemon(nextPokemon);
                });
                modal.appendChild(nextButton);
                nextButton.focus();
            } else {
                previousButton.focus();
            };
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
                        showDetails(correctPokemon, previousPokemon);
                    };
                } else {
                    previousPokemon = pokemon.name;
                };
            });
        };

        function findPrevious(direction) {
            var previousPokemon, nextPokemon, correctPokemon, pokemonFound;
            pokemonFound = false;
            pokemonRepository.getAll().forEach(function (pokemon) {
                switch (true) {
                    case activePokemon === 'mew':
                        findCorrectPokemon('mewtwo')
                    case pokemonFound === true:
                        nextPokemon = pokemon.name;
                        pokemonFound = false;
                        if (direction === 'next') {
                            findCorrectPokemon(nextPokemon);
                        } else if (direction === 'previous') {
                            findCorrectPokemon(previousPokemon);
                        };
                        break;
                    case pokemon.name === activePokemon:
                        pokemonFound = true;
                        break;
                    default:
                        previousPokemon = pokemon.name;
                        break;
                };
            });
        };

        function hideModal() {
            var $modalContainer = $('#modal-container');
            $modalContainer.removeClass('is-visible');
        };

        function modalEvents() {
            var $modalContainer = $('#modal-container');
            $modalContainer.click(function (event) {
                var target = event.target;
                if (target.id === 'modal-container') {
                    hideModal();
                };
            });
            // Making the modal close on button click ('x button')
            $('.modal-close').click(hideModal);
            // Making modal visible to user
            $modalContainer.addClass('is-visible');
        }

        function modalMove(event) {
            switch (true) {
                case event.key === 'Escape':
                    hideModal();
                    break;
                case event.key === 'ArrowRight':
                    var target = findPrevious('next');
                    break;
                case event.key === 'ArrowLeft':
                    var target = findPrevious('previous');
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
        if ($modalContainer.hasClass('is-visible')) {
            createPokemon.move(event);
        };
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
