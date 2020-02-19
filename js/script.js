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

    var pokemonRepository = (function () { //Start of repository IIFE
        // The location all pokemon will be listed in
        var repository = [];
        // URL for API pokemon come from
        var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

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

        // Creates "Wow that's big!" text from previous assignment
        function createHieghtText(height) {
            var heightText
            if (height >= 10) {
                heightText = `(height: ${height}m) - Wow, that's big!`;
            } else {
                heightText = `(height: ${height}m)`;
            };
            return heightText;
        };

        // Pulls pokemon list
        var $listContainer = document.querySelector('.pokemon-list');

        var addListItem = function (pokemon) {
            // Creating the list item for the pokemon
            var listItem = document.createElement('li');
            // Creating the button the pokemon element will be in
            var itemButton = document.createElement('button')
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

        function showDetails(item) {
            // Loads the API for pokemon details on click instead of on load
            pokemonRepository.loadDetails(item).then(function () {
                console.log(item);
            });
        };

        var eventFunction = function (button, pokemon) {
            // Creates functionality for clicking the button
            button.addEventListener('click', function () {
                showDetails(pokemon);
            });
        };

        return {
            add: addListItem,
        };
    })();
    //Start of 'global' IIFE funtionality

    // Runs API load for data
    pokemonRepository.loadList().then(function () {
        pokemonRepository.getAll().forEach(function (pokemon) {
            // Runs the list of functions to create button list for pokemon
            createPokemon.add(pokemon);
        });
    });
    toggleDisplay('off');
})();
