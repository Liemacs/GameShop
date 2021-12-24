const SortG = document.getElementById('low_high');
$(document).ready(() => {
    // variables //

    const genre = $('#genre');
    const platform = $('#platform');
    let arrGenre = [];
    let uniqueGenre = [];

    // variables //

    // connection to local API //
    fetch('gameAPI.json')
        .then(response => {
            return response.json()
        })
        .then(games => {
            games.forEach(game => {
                arrGenre.push(game.genre)
            });
            arrGenre.forEach((element) => {
                if (!uniqueGenre.includes(element)) uniqueGenre.push(element)
            })
            uniqueGenre.forEach(unique => {
                $(genre).append(`<option value="${unique}">${unique}</option>`)
            })
        })

    genre.on('change', getSelectGame)
    platform.on('change', getSelectPlatform)
    $('#low_high').on('change', SortBy)
    $('#at-numb-price').on('change', showPriceGame)
    $('#to-numb-price').on('change', showPriceGame)
    showGame()
})
// propertychange input

function showGame() {
    fetch('gameAPI.json')
        .then(response => response.json())
        .then(games => {
            showGameMain(games);
        })
}

function gameDetails(gameID) {
    sessionStorage.setItem('gameID', gameID)
    window.location = 'game.html'
}

function SortBy() {
    fetch('gameAPI.json')
        .then(response => response.json())
        .then(games => {
            if (SortG.value === "Unselected") {
                $('.content-games').html('')
                showGameMain(games)
            } else if (SortG.value === "High") {
                let high = games.sort((a, b) => {
                    return b.price - a.price
                })
                $('.content-games').html('')
                showGameMain(high);
            } else if (SortG.value === "Low") {
                let low = games.sort((a, b) => {
                    return a.price - b.price
                })
                $('.content-games').html('')
                showGameMain(low);
            } else if (SortG.value === "Best") {
                let best = games.sort((a, b) => {
                    return b.rating - a.rating
                })
                $('.content-games').html('')
                showGameMain(best);
            }
        })
}

function getSelectGame() {
    fetch('gameAPI.json')
        .then(response => response.json())
        .then(games => {
            if (genre.value === "All") {
                $('.content-games').html('')
                showGameMain(games)
            } else {
                let gamesArr = games.filter(game => {
                    return game.genre === genre.value
                })
                $('.content-games').html('')
                showGameMain(gamesArr);
            }
        })
}

function getSelectPlatform() {
    fetch('gameAPI.json')
        .then(response => response.json())
        .then(games => {
            let gamesArr = games.filter(game => {
                for (let i = 0; i < game.platform.length; i++) {
                    if (game.platform[i] === platform.value)
                        return game.platform[i];
                }
            });
            $('.content-games').html('');
            showGameMain(gamesArr);
        });
}


function showPriceGame() {
    fetch('gameAPI.json')
        .then(response => response.json())
        .then(games => {
            let atPrice = Number($('#at-numb-price').val())
            let toPrice = Number($('#to-numb-price').val())
            console.log(toPrice)
            console.log(atPrice)
            let sortGame = games.filter(game => {
                if (game.price >= atPrice && game.price < toPrice) return game
                if (game.price >= atPrice && toPrice == 0) return game
                if (game.price < toPrice && atPrice == 0) return game

            })
            $('.content-games').html('')
            showGameMain(sortGame)
        })
}

function showGameMain(games) {
    let output = '';
    games.forEach(game => {
        output += `
            <a href="#" onclick="gameDetails('${game.id}')" class="game-box">
                <div class="card-game-img">
                    <img src="${game.img}">
                </div>
                <div class="card-price-box">
                    <span class="card-price">${game.price == 0 ? "free" : game.price + " $"}</span>
                </div>
                <h4>${game.title}</h4>
            </a>
            `
    })
    $('.content-games').append(output)
}

function getDetailsGame() {
    let gameID = sessionStorage.getItem('gameID')
    fetch('gameAPI.json')
        .then(response => response.json())
        .then(games => {
            let output = ''
            games.forEach((game, index) => {
                if (index == gameID) {
                    output += `
                    <div class="content-box-game">
                    <div class="img">
                        <img src="${game.img}" alt="dsf">
                    </div>
                    <div class="game-info">
                        <h1>${game.title}</h1>
                        <div class="genre_release">
                            <span>Genre: ${game.genre}</span>
                            <span>Release: ${game.release_date}</span>
                            <span>Rating: ${game.rating}</span>
                        </div>
                        <h2>System requirements</h2>
                        <div class="pub-req-box">
                        <div class="requirements-box">
                        <div class="requirements">
                        <h3>OS:</h3>
                        <p>${game.System_requirements.OS}</p>
                    </div>
                    <div class="requirements">
                        <h3>CPU:</h3>
                        <p>${game.System_requirements.CPU}</p>
                    </div>
                    <div class="requirements">
                        <h3>VGA:</h3>
                        <p>${game.System_requirements.VGA}</p>
                    </div>
                    <div class="requirements">
                        <h3>RAM:</h3>
                        <p>${game.System_requirements.RAM}</p>
                    </div>
                    <div class="requirements">
                        <h3>Storage:</h3>
                        <p>${game.System_requirements.Storage}</p>
                    </div>
                        </div>
                        <div class="dev-publ-box">
                        <div class="dev-pub">
                            <h3>Publisher:</h3>
                            <p>${game.publisher}</p>
                        </div>
                        <div class="dev-pub">
                            <h3>Developer:</h3>
                            <p>${game.developer}</p>
                        </div>
                    </div>
                        </div>
                        </div>
                        </div>
                        <p class="description">${game.description}</p>
                        <div class="supportPlatform"></div>
                    `
                }
            })
            $('.content-game').append(output)
        })
}

function ShowSpec() {
    let gameID = sessionStorage.getItem('gameID')
    fetch('gameAPI.json')
        .then(response => response.json())
        .then(games => {
            let output = ''
            games.forEach((game, index) => {
                if (index == gameID) {
                    for (let i = 0; i < game.platform.length; i++) {
                        output += `
                <span>${game.platform[i]}</span>
                `
                    }
                }
            })
            $('.supportPlatform').append(output)
        })
}