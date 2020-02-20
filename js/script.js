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
        var loadingImg = document.querySelector('.loading-image');
        if (power === 'off') {
            loadingImg.parentNode.removeChild(loadingImg);
        } else if (power === 'on') {
            var pokeball = document.createElement('img');
            pokeball.classList.add('loading-image');
            document.querySelector('.loading-prompt').appendChild(pokeball);
            document.querySelector('.loading-image').src = 'img/pokeball.gif';
        }
    }

    toggleDisplay('on');
    var pokemonRepository = (function () { //Start of repository IIFE
        // The location all pokemon will be listed in
        var repository = [];
        // URL for API pokemon come from
        var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

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
            // Gets pokemon from the API
            return fetch(apiUrl).then(function (response) {
                return response.json();
            }).then(function (json) {
                json.results.forEach(function (item) {
                    // Creates pokemon item and attaches URL for details to be used later
                    var pokemon = {
                        name: item.name,
                        detailsUrl: item.url,
                    };
                    add(pokemon);
                });
                toggleDisplay('off')
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
            add: add,
            getAll: getAll,
            loadList: loadList,
            loadDetails: loadDetails,
        };
    })();

    var createPokemon = (function () { //Start of create Pokemon IIFE
        // Pulls pokemon list
        var $listContainer = document.querySelector('.pokemon-list');

        var addListItem = function (pokemon) {
            // Creating the list item for the pokemon
            var listItem = document.createElement('li');
            // Creating the button the pokemon element will be in
            var itemButton = document.createElement('button');
            // Changing text to pokemon name
            itemButton.innerHTML = pokemon.name;
            // Adding CSS class to button for styling
            itemButton.classList.add('item-button');
            eventFunction(itemButton, pokemon);
            // Adding the button to the pokemon list item
            listItem.appendChild(itemButton);
            // Adding the list item to the list
            $listContainer.appendChild(listItem);
        };

        var eventFunction = function (button, pokemon) {
            var previousPokemon, nextPokemon
            // Creates functionality for clicking the button
            button.addEventListener('click', function () {
                if (button.parentNode.previousSibling !== null) {
                    previousPokemon = button.parentNode.previousSibling.childNodes[0].innerHTML;
                };
                if (button.parentNode.nextSibling !== null) {
                    nextPokemon = button.parentNode.nextSibling.childNodes[0].innerHTML;
                };
                showDetails(pokemon, previousPokemon, nextPokemon);
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
            var properties
            for (i = 0; i < item.length; i++) {
                // Sets visible content to first array item
                if (properties === undefined) {
                    properties = item[i];
                } else {
                    // Adds additional items in array below subsequent items
                    properties += '<br> ' + item[i];
                };
            };
            // returns list for use
            return properties;
        };

        function showModal(title, heightText, typesText, abilityText, picture, id) {

            // Defining where modal belongs
            var $modalContainer = document.querySelector('#modal-container');
            // Empties modal of all previous content
            $modalContainer.innerHTML = '';

            // Creating modal
            var modal = document.createElement('div');
            modal.classList.add('modal');

            // Creating close button for modal
            var closeButtonElement = document.createElement('button');
            closeButtonElement.classList.add('modal-close');
            closeButtonElement.innerHTML = 'Close';
            closeButtonElement.addEventListener('click', hideModal);

            // Creating header with pokemon name for modal
            var titleElement = document.createElement('h1');
            titleElement.innerHTML = `${title} (${id})`;

            // Creating height section of body of modal
            var elementHeaderHeight = document.createElement('h2');
            elementHeaderHeight.innerHTML = 'height (dm):';
            elementHeaderHeight.classList.add('h2');
            var contentElementHeight = document.createElement('p');
            contentElementHeight.classList.add('modalText-p');
            contentElementHeight.innerHTML = heightText;

            // Creating types section of body of modal
            var elementHeaderTypes = document.createElement('h2');
            elementHeaderTypes.innerHTML = 'types:';
            elementHeaderTypes.classList.add('h2');
            var contentElementTypes = document.createElement('p');
            contentElementTypes.classList.add('modalText-p');
            contentElementTypes.innerHTML = typesText;

            // Creating abilities section of body of modal
            var elementHeaderAbility = document.createElement('h2');
            elementHeaderAbility.innerHTML = 'abilities:';
            elementHeaderAbility.classList.add('h2');
            var contentElementAbility = document.createElement('p');
            contentElementAbility.classList.add('modalText-p');
            contentElementAbility.innerHTML = abilityText;

            // Creating picture for modal
            var contentPicture = document.createElement('img');
            contentPicture.classList.add('pokemon-picture');

            // Appending all items to correct spots
            modal.appendChild(closeButtonElement);
            modal.appendChild(titleElement);
            modal.appendChild(contentPicture);
            modal.appendChild(elementHeaderHeight);
            modal.appendChild(contentElementHeight);
            modal.appendChild(elementHeaderTypes);
            modal.appendChild(contentElementTypes);
            modal.appendChild(elementHeaderAbility);
            modal.appendChild(contentElementAbility);
            $modalContainer.appendChild(modal);

            // Adding picture to modal -has to be done here after picture is defined and placed on document
            document.querySelector('.pokemon-picture').src = picture;

            // Adding event listener for clicking outside of the modal text-area
            $modalContainer.addEventListener('click', function (event) {
                var target = event.target;
                if (target === $modalContainer) {
                    hideModal();
                };
            });
            // Making modal visible to user
            $modalContainer.classList.add('is-visible');
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
                previousButton.focus()
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
                    if (pokemon.id = 151){
                        showDetails(correctPokemon, previousPokemon);
                    };
                } else {
                    previousPokemon = pokemon.name;
                };
            });
        };

        function hideModal() {
            var $modalContainer = document.querySelector('#modal-container');
            $modalContainer.classList.remove('is-visible');
        };

        return {
            add: addListItem,
            hide: hideModal,
        };

    })();
    //Start of 'global' IIFE funtionality
    window.addEventListener('keydown', function (event) {
        var $modalContainer = document.querySelector('#modal-container');
        if (event.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
            createPokemon.hide();
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
