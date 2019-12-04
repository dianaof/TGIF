// var membersSenate;

let chamber;

if (document.URL.includes("senate")) {
  chamber = "senate";
} else {
  chamber = "house";
}

fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
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
    membersSenate = json.results[0].members;

    // loader();
    // createTable(senateMembers);
    // stateSelect();
  })
  .catch(function(error) {
    console.log("Request failed: " + error.message);
  });

// var membersSenate = data.results[0].members;

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

var tenpct = Math.round(membersSenate.length * 0.1);
var listVotesBottom = [];
var listVotesTop = [];
var orderedTop = Array.from(membersSenate);
var orderedBottom = Array.from(membersSenate);

function populateStatistics() {
  var demTotalVotes = 0;
  var repTotalVotes = 0;
  var indTotalVotes = 0;

  for (var i = 0; i < membersSenate.length; i++) {
    if (membersSenate[i].party == "D") {
      statistics.numDem += 1;
      demTotalVotes = demTotalVotes + membersSenate[i].votes_with_party_pct;
    } else if (membersSenate[i].party == "R") {
      statistics.numRep = statistics.numRep + 1;
      repTotalVotes = repTotalVotes + membersSenate[i].votes_with_party_pct;
    } else {
      statistics.numInd = statistics.numInd + 1;
      indTotalVotes = indTotalVotes + membersSenate[i].votes_with_party_pct;
    }
  }

  statistics.demVotesPct = demTotalVotes / statistics.numDem;

  statistics.repVotesPct = repTotalVotes / statistics.numRep;

  statistics.indVotesPct = indTotalVotes / statistics.numInd;

  statistics.totalNum =
    statistics.numDem + statistics.numRep + statistics.numInd;

  statistics.totalVotes =
    (statistics.demVotesPct + statistics.repVotesPct + statistics.indVotesPct) /
    3;
}

function fillAtGlanceTable() {
  var statisticsTable = document.getElementById(
    "senate-house-attendance-table"
  );

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

populateStatistics();
fillAtGlanceTable();

function pctLoyaltyTopBottom() {
  orderedTop.sort(function(a, b) {
    return a.missed_votes_pct - b.missed_votes_pct;
  });

  for (var i = 0; i < tenpct; i++) {
    listVotesTop.push(orderedTop[i]);
  }

  for (i = tenpct; i < orderedTop.length; i++) {
    if (
      listVotesTop[listVotesTop.length - 1].missed_votes_pct ==
      orderedTop[i].missed_votes_pct
    ) {
      listVotesTop.push(orderedTop[i]);
    }
  }

  // console.log(listVotesTop);

  createTableTop(listVotesTop);

  //----------

  orderedBottom.sort(function(a, b) {
    return b.missed_votes_pct - a.missed_votes_pct;
  });

  for (var i = 0; i < tenpct; i++) {
    listVotesBottom.push(orderedBottom[i]);
  }

  // for (i=tenpct; i < orderedBottom.length; i++){

  //     if (listVotesBottom[listVotesBottom.length -1].missed_votes_pct == orderedBottom[i].missed_votes_pct) {
  //        listVotesBottom.push(orderedBottom[i]);
  //     }

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
    noMissedVotes.innerHTML = listBottom[i].missed_votes;

    var tenPctMissedVotes = document.createElement("td");
    tenPctMissedVotes.innerHTML = listBottom[i].missed_votes_pct + "%";

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
    noMissedVotes.innerHTML = listTop[i].missed_votes;

    var tenPctMissedVotes = document.createElement("td");
    tenPctMissedVotes.innerHTML = listTop[i].missed_votes_pct + "%";

    newRow.append(name, noMissedVotes, tenPctMissedVotes);
    document.getElementById("table-pcttop").appendChild(newRow);
  }
  // console.log(createTableTop)
}

function loader() {
  document.getElementById("loader").style.display = "none";
}
