let chamber;

if (document.URL.includes("senate")) {
  chamber = "senate";
} else {
  chamber = "house";
}

fetch(`https://api.propublica.org/congress/v1/113/${chamber}/members.json`, {
  method: "GET",
  headers: {
    "X-API-key": "USiTg4aV1o26w6EjIpr190WMQ6HdnmD1gael0wFG"
  }
})
  .then(function(response) {
    if (response.ok) {
      console.log(response);
      return response.json();
    }

    throw new Error(response.statusText);
  })
  .then(function(json) {
    var members = json.results[0].members;

    loader();
    populateStatistics(members);
    fillAtGlanceTable(members);
    createTableBottom(members);
    createTableTop(members);
    pctLoyaltyTopBottom(members);

    console.log(members);
  })
  .catch(function(error) {
    console.log("Request failed: " + error.message);
  });

var statistics = {
  numDem: 0,
  numRep: 0,
  numInd: 0,
  demVotesPct: 0,
  repVotesPct: 0,
  indVotesPct: 0,
  totalNum: 0,
  totalVotes: 0
};

var tenpct = Math.round(members.length * 0.1);
var listVotesBottom = [];
var listVotesTop = [];
var orderedTop = Array.from(members);
var orderedBottom = Array.from(members);

function populateStatistics(members) {
  var demTotalVotes = 0;
  var repTotalVotes = 0;
  var indTotalVotes = 0;

  for (var i = 0; i < members.length; i++) {
    if (members[i].party == "D") {
      statistics.numDem = statistics.numDem + 1;
      demTotalVotes = demTotalVotes + members[i].votes_with_party_pct;
    } else if (members[i].party == "R") {
      statistics.numRep = statistics.numRep + 1;
      repTotalVotes = repTotalVotes + members[i].votes_with_party_pct;
    } else {
      statistics.numInd = statistics.numInd + 1;
      indTotalVotes = indTotalVotes + members[i].votes_with_party_pct;
    }
  }

  statistics.demVotesPct = demTotalVotes / statistics.numDem;

  statistics.repVotesPct = repTotalVotes / statistics.numRep;

  statistics.indVotesPct = indTotalVotes / statistics.numRep;

  statistics.totalNum =
    statistics.numDem + statistics.numRep + statistics.numInd;

  statistics.totalVotes =
    (statistics.demVotesPct + statistics.repVotesPct + statistics.indVotesPct) /
    3;
}

function fillAtGlanceTable(members) {
  var statisticsTable = document.getElementById("loyalty-table");

  var democratsRow = document.createElement("tr");
  var demParty = document.createElement("td");
  var demMembers = document.createElement("td");
  var demVotes = document.createElement("td");

  demParty.innerHTML = "Democrats";
  demMembers.innerHTML = statistics.numDem;
  demVotes.innerHTML = statistics.demVotesPct.toFixed(2) + "%";

  democratsRow.append(demParty, demMembers, demVotes);
  statisticsTable.appendChild(democratsRow);

  var republicansRow = document.createElement("tr");
  var repParty = document.createElement("td");
  var repMembers = document.createElement("td");
  var repVotes = document.createElement("td");

  repParty.innerHTML = "Republicans";
  repMembers.innerHTML = statistics.numRep;
  repVotes.innerHTML = statistics.repVotesPct.toFixed(2) + "%";

  republicansRow.append(repParty, repMembers, repVotes);
  statisticsTable.appendChild(republicansRow);

  var independentsRow = document.createElement("tr");
  var indParty = document.createElement("td");
  var indMembers = document.createElement("td");
  var indVotes = document.createElement("td");

  indParty.innerHTML = "Independents";
  indMembers.innerHTML = statistics.numInd;
  indVotes.innerHTML = statistics.indVotesPct.toFixed(2) + "%";

  independentsRow.append(indParty, indMembers, indVotes);
  statisticsTable.appendChild(independentsRow);

  var totalRow = document.createElement("tr");
  var totalParty = document.createElement("td");
  var totalMembers = document.createElement("td");
  var totalVotes = document.createElement("td");

  totalParty.innerHTML = "Total";
  totalMembers.innerHTML = statistics.totalNum;
  totalVotes.innerHTML = statistics.totalVotes.toFixed(2) + "%";

  totalRow.append(totalParty, totalMembers, totalVotes);
  statisticsTable.appendChild(totalRow);

  // console.log(statistics)
}

function pctLoyaltyTopBottom(members) {
  var loyaltyTop = document.getElementById("table-pcttop");

  orderedTop.sort(function(a, b) {
    return a.votes_with_party_pct - b.votes_with_party_pct;
  });

  for (var i = 0; i < tenpct; i++) {
    listVotesTop.push(orderedTop[i]);
  }

  createTableTop(listVotesTop);

  //----------

  var loyaltyBottom = document.getElementById("table-pctbottom");

  orderedBottom.sort(function(a, b) {
    return b.votes_with_party_pct - a.votes_with_party_pct;
  });

  for (var i = 0; i < tenpct; i++) {
    listVotesBottom.push(orderedBottom[i]);
  }

  createTableBottom(listVotesBottom);
}

pctLoyaltyTopBottom();

function createTableBottom(listBottom) {
  for (var i = 0; i < listBottom.length; i++) {
    var newRow = document.createElement("tr");

    var name = document.createElement("td");
    if (listBottom[i].middle_name == null) {
      name.innerHTML = listBottom[i].first_name + " " + listBottom[i].last_name;
    } else {
      name.innerHTML =
        listBottom[i].first_name +
        " " +
        listBottom[i].middle_name +
        " " +
        listBottom[i].last_name;
    }

    var noMissedVotes = document.createElement("td");
    noMissedVotes.innerHTML = listBottom[i].total_votes;

    var tenPctMissedVotes = document.createElement("td");
    tenPctMissedVotes.innerHTML = listBottom[i].votes_with_party_pct + "%";

    newRow.append(name, noMissedVotes, tenPctMissedVotes);
    document.getElementById("table-pctbottom").appendChild(newRow);
  }
}

function createTableTop(listTop) {
  for (var i = 0; i < listTop.length; i++) {
    var newRow = document.createElement("tr");

    var name = document.createElement("td");
    if (listTop[i].middle_name == null) {
      name.innerHTML = listTop[i].first_name + " " + listTop[i].last_name;
    } else {
      name.innerHTML =
        listTop[i].first_name +
        " " +
        listTop[i].middle_name +
        " " +
        listTop[i].last_name;
    }

    var noMissedVotes = document.createElement("td");
    noMissedVotes.innerHTML = listTop[i].total_votes;

    var tenPctMissedVotes = document.createElement("td");
    tenPctMissedVotes.innerHTML = listTop[i].votes_with_party_pct + "%";

    newRow.append(name, noMissedVotes, tenPctMissedVotes);
    document.getElementById("table-pcttop").appendChild(newRow);
  }
  // console.log(createTableTop)
}

function loader() {
  document.getElementById("loader").style.display = "none";
}

// statistics object

//function populateStatistics(members)

//createGlanceTable(statistics)

// calculateTopTenPct(members){
//createTable(array, "mostId")
//}

//calculateBotTenPct(members){
//createTable(array, "leastId")
//}

//createTable(list, id)
