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
                var types = cleanListLook(item.types);
                var abilities = cleanListLook(item.abilities);
                showModal(item.name, `<p>height: ${item.height}</p><p>types: ${types}</p><p>abilities: ${abilities}</p>`, item.imageUrl);
            });
        };

        function cleanListLook(item) {
            var properties
            for (i = 0; i < item.length; i++) {
                if (properties === undefined) {
                    properties = `<br> ${item[i]}`;
                } else {
                    properties += `<br> ${item[i]}`
                };
            };
            return properties;
        };

        var eventFunction = function (button, pokemon) {
            // Creates functionality for clicking the button
            button.addEventListener('click', function () {
                showDetails(pokemon);
            });
        };

        function showModal(title, text, picture) {
            var $modalContainer = document.querySelector('#modal-container');
            $modalContainer.innerHTML = '';

            var modal = document.createElement('div');
            modal.classList.add('modal');

            var closeButtonElement = document.createElement('button');
            closeButtonElement.classList.add('modal-close');
            closeButtonElement.innerHTML = 'Close';
            closeButtonElement.addEventListener('click', hideModal);

            var titleElement = document.createElement('h1');
            titleElement.innerHTML = title;

            var contentElement = document.createElement('p');
            contentElement.innerHTML = text;

            var contentPicture = document.createElement('img');
            contentPicture.classList.add('pokemon-picture');

            modal.appendChild(closeButtonElement);
            modal.appendChild(titleElement);
            modal.appendChild(contentPicture);
            modal.appendChild(contentElement);
            $modalContainer.appendChild(modal);

            document.querySelector('.pokemon-picture').src = picture;

            $modalContainer.addEventListener('click', function (event) {
                var target = event.target;
                if (target === $modalContainer) {
                    hideModal();
                };
            });
            $modalContainer.classList.add('is-visible');
        };

        function hideModal() {
            var $modalContainer = document.querySelector('#modal-container');
            $modalContainer.classList.remove('is-visible');
        };


        function addPicture(url) {
            document.querySelector('.pokemon-picture').src = url;
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
        });
    });
    toggleDisplay('off');
})();
