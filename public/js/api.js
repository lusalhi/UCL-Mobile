const BASE_URL = "https://api.football-data.org/v2";
const API_KEY = "3eeb6812c12b42369ff509f6920e3af3";

const PRELOADER = `
    <div class="center">
    <div class="preloader-wrapper big active">
    <div class="spinner-layer spinner-blue-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
    </div>
    </div>`

function status(response) {
    if (response.status !== 200) {
        return Promise.reject(Error(response.statusText));
    }
    return Promise.resolve(response);
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log('Error: ' + error);
}

async function getData() {

    $("#stands-content").html(PRELOADER);

    let res = '';
    if ('caches' in window) res = await caches.match(`${BASE_URL}/competitions/CL/standings?standingType=TOTAL`);
    if (res) {
        res = await json(res);
    } else {
        res = await fetch(`${BASE_URL}/competitions/CL/standings?standingType=TOTAL`, { headers: { 'X-Auth-Token': API_KEY } })
            .then(status)
            .then(json)
            .catch(error);
    }

    let { standings } = res;
    let standingCard = '';
    standings.forEach((standing) => {
        let tableContent = '';

        standing.table.forEach((club) => {
            tableContent += `
            <a href="club.html?id=${club.team.id}" class="collection-item primary-text row">
                <div class="col s8">${club.team.name}</div>
                <div class="col s2">${club.playedGames}</div>
                <div class="col s2">${club.points}</div>
            </a>`
        });

        standingCard += `
            <h5>${standing.group.replace("_", " ")}</h5>
            <ul class="collection">
                <li class="collection-item primary-color white-text row">
                        <div class="col s8">Club</div>
                        <div class="col s2">Play</div>
                        <div class="col s2">Points</div>
                </li>
                ${tableContent}
            </ul>
            
        `
    });
    $("#stands-content").html(standingCard);
}

async function getDetail() {
    $("#club").html(PRELOADER);
    try {
        let club = await getClubDetail();
        let { matches } = await getClubMatches();

        club['matches'] = matches;

        let clubInfo = `
    <div class="center">
        <img class="responsive-img" src="${club.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="${club.name}" style="max-width: 100px;">
        <h5>${club.name}</h5>
    </div>
    <br>
    `
        let squadInfo = ''

        let position1 = '';
        let position2 = '';
        club.squad.forEach((player) => {
            position1 = position2
            position2 = player.position?.toUpperCase() ?? "MANAGER";
            if (position2 !== position1) {
                squadInfo += `
            </ul>
            <h5>${player.position?.toUpperCase() ?? "MANAGER"}</h5>
            <hr/>
            <ul class="collection">`
            }
            squadInfo += `
        <li class="collection-item primary-color white-text">${player.name.toUpperCase()}</li>
        `
        });

        const matchData = club.matches;

        let matchCard = "<br>"
        let date = ''
        matchData.forEach((match) => {
            date = new Date(match.utcDate).toDateString();
            matchCard += `
        <div>
            <h5 class="primary-text">${match.stage.replace("_", " ").replace("_", " ")} ${match.matchday ?? ""}</h5>
            <div class="card-panel primary-color">
                <span class="white-text">${date}</span>
                <hr/>
                <br>
                <div class="row">
                    <div class="col s10 white-text">${match.homeTeam.name}</div>
                    <div class="col s2 white-text"> ${match.score.fullTime.homeTeam ?? "-"}</div>
                </div>
                <div class="row">
                    <div class="col s10 white-text">${match.awayTeam.name}</div>
                    <div class="col s2 white-text"> ${match.score.fullTime.awayTeam ?? "-"}</div>
                </div>
            </div>
        </div>`
        });

        $("#club").html(clubInfo);
        $("#squad").html(squadInfo);
        $("#matches").html(matchCard);

        return club;
    } catch (e) {
        $("#club-container").html(`<p>Terjadi kesalahan</p>`);
        console.log(e);
        M.toast({html: e, classes: "red"});
    }
}

async function getClubDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");

    let res = '';
    if ('caches' in window) res = await caches.match(`${BASE_URL}/teams/${idParam}`);
    if (res) {
        res = await json(res);
    } else {
        res = await fetch(`${BASE_URL}/teams/${idParam}`, { headers: { 'X-Auth-Token': API_KEY } })
            .then(status)
            .then(json)
    }
    return res;
}

async function getClubMatches() {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");

    let res = '';
    if ('caches' in window) res = await caches.match(`${BASE_URL}/teams/${idParam}/matches/?competitions=CL`);
    if (res) {
        res = await json(res);
    } else {
        res = await fetch(`${BASE_URL}/teams/${idParam}/matches/?competitions=CL`, { headers: { 'X-Auth-Token': API_KEY } })
            .then(status)
            .then(json)
            .catch(error);
    }
    return res;
}

async function getFavorites() {
    let clubs = await getAll();
    console.log(clubs);
    // Menyusun komponen card artikel secara dinamis
    let clubHTML = "";
    if (clubs.length === 0) {
        clubHTML = "<p class='center-align'>Club favorite masih kosong</p>"
    } else {
        clubs.forEach((club) => {
            let description = club.name;
            clubHTML += `
                    <div class="card-panel center">
                      <a href="./club.html?id=${club.id}">
                        <div class="waves-effect waves-block waves-light">
                          <img class="responsive-img" src="${club.crestUrl.replace(/^http:\/\//i, 'https://')}" />
                        </div>
                      </a>
                      <div class="card-content">
                        <p>${description}</p>
                      </div>
                    </div>
                  `;
        });
    }
    $('#fav-content').html(clubHTML);
}

function getSavedArticleById(detail) {
    let clubInfo = `
            <div class="center">
                <img class="responsive-img" src="${detail.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="${detail.name}" style="max-width: 100px;">
                <h5>${detail.name}</h5>
            </div>
            <br>
            `
    let squadInfo = ''
    let position1 = '';
    let position2 = '';
    detail.squad.forEach((player) => {
        position1 = position2
        position2 = player.position?.toUpperCase() ?? "MANAGER";
        if (position2 !== position1) {
            squadInfo += `
                    </ul>
                    <h5>${player.position?.toUpperCase() ?? "MANAGER"}</h5>
                    <hr/>
                    <ul class="collection">`
        }
        squadInfo += `
                <li class="collection-item primary-color white-text">${player.name.toUpperCase()}</li>
                `
    });

    $("#club").html(clubInfo);
    $("#squad").html(squadInfo);

    const { matches } = detail;
    let matchCard = "<br>"
    let date = ''
    matches.forEach((match) => {
        date = new Date(match.utcDate).toDateString();
        matchCard += `
                <div>
                    <h5 class="primary-text">${match.stage.replace("_", " ").replace("_", " ")} ${match.matchday ?? ""}</h5>
                    <div class="card-panel primary-color">
                        <span class="white-text">${date}</span>
                        <hr/>
                        <br>
                        <div class="row">
                            <div class="col s10 white-text">${match.homeTeam.name}</div>
                            <div class="col s2 white-text"> ${match.score.fullTime.homeTeam ?? "-"}</div>
                        </div>
                        <div class="row">
                            <div class="col s10 white-text">${match.awayTeam.name}</div>
                            <div class="col s2 white-text"> ${match.score.fullTime.awayTeam ?? "-"}</div>
                        </div>
                    </div>
                </div>`
    });
    $("#matches").html(matchCard);
}