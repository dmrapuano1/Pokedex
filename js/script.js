var myApplication = (function () {

    var pokemonRepository = (function () { //Start of repository IIFE

        function Pokemon(name, height, ...types) {
            this.name = name;
            this.height = height;
            this.types = [types];
        }

        var repository = [
            new Pokemon('Bulbasaur', 0.7, 'grass', 'poison'),
            new Pokemon('Charmander', 0.6, 'fire'),
            new Pokemon('Squirtle', 0.5, 'water'),
            new Pokemon('Ninetales', 1.1, 'fire'),
    ];

        function add(name, height, ...types) {
            if (typeof (name) !== 'string') {
                alert(typeof name);
                return false;
            }
            if (typeof (height) !== 'number') {
                alert('Height must be a number');
                return false;
            }
            for (i = 0; i < types.length; i++) {
                if (typeof (types[i]) !== 'string') {
                    alert(`All types must be a string. '${types[i]}' is not a string`);
                    return false;
                }
            }
            this.name = new Pokemon(name, height, ...types);
            repository.push(this.name);
        };

        function getAll() {
            return repository;
        }
        return {
            add: add,
            getAll: getAll
        };
    })();

    var createPokemon = (function () { //Start of create Pokemon IIFE
        function createHieghtText(height) {
            var heightText
            if (height >= 1) {
                heightText = `(height: ${height}m) - Wow, that's big!`;
            } else {
                heightText = `(height: ${height}m)`;
            };
            return heightText;
        };

        var $listContainer = document.querySelector('.pokemon-list');

        var addListItem = function (pokemon) {
            var listItem = document.createElement('li');
            var itemButton = document.createElement('button')
            itemButton.innerHTML = pokemon.name;
            itemButton.classList.add('item-button');
            itemButton.addEventListener('click', showDetails);
            listItem.appendChild(itemButton);
            $listContainer.appendChild(listItem);
        };

        var showDetails = function (pokemon) {
            console.log(pokemon);
        };

        return {
            add: addListItem,
        };
    })();
    //Start of 'global' IIFE funtionality
    var list = pokemonRepository.getAll();
    list.forEach(function (currentObject) {
        createPokemon.add(currentObject);
    })

})();
