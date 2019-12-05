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
    const members = json.results[0].members;

    loader();
    eventListeners(members);
    createTable(members);
    stateSelect(members);

    console.log(members);
  })
  .catch(function(error) {
    console.log("Request failed: " + error.message);
  });

function createTable(list) {
  document.getElementById("table").innerHTML = "";

  for (var i = 0; i < list.length; i++) {
    var newRow = document.createElement("tr");

    var fullName = document.createElement("td");

    if (list[i].middle_name == null) {
      fullName.innerHTML = list[i].first_name + " " + list[i].last_name;
    } else {
      fullName.innerHTML =
        list[i].first_name +
        " " +
        list[i].middle_name +
        " " +
        list[i].last_name;
    }

    var govParty = document.createElement("td");
    govParty.innerHTML = list[i].party;

    var govState = document.createElement("td");
    govState.innerHTML = list[i].state;

    var govSeniority = document.createElement("td");
    govSeniority.innerHTML = list[i].seniority;

    var percentageOfVotes = document.createElement("td");
    percentageOfVotes.innerHTML = list[i].votes_with_party_pct + "%";

    newRow.append(
      fullName,
      govParty,
      govState,
      govSeniority,
      percentageOfVotes
    );

    document.getElementById("table").append(newRow);
  }
}

function eventListeners(array) {
  document.getElementById("republican").addEventListener("click", function() {
    stateClick(array);
  });
  document.getElementById("democrat").addEventListener("click", function() {
    stateClick(array);
  });
  document.getElementById("independent").addEventListener("click", function() {
    stateClick(array);
  });
  document.getElementById("stateSelect").addEventListener("change", function() {
    stateClick(array);
  });
}

function stateSelect(members) {
  var dropdownList = document.getElementById("stateSelect");

  var listStates = [];

  for (var i = 0; i < members.length; i++) {
    if (!listStates.includes(members[i].state)) {
      listStates.push(members[i].state);
    }
  }
  //Hello people
  listStates.sort();

  for (var i = 0; i < listStates.length; i++) {
    var newOption = document.createElement("option"); // we create one option element

    newOption.innerHTML = listStates[i]; // we make the value of the option equale to each value of our new container

    dropdownList.append(newOption); // we put the option in select
  }
}

function stateClick(members) {
  var filteredStateMembers = [];

  var dropdownList = document.getElementById("stateSelect");

  for (var i = 0; i < members.length; i++) {
    if (members[i].state == dropdownList.value || dropdownList.value == "All") {
      if (
        members[i].party == "D" &&
        document.getElementById("democrat").checked
      ) {
        filteredStateMembers.push(members[i]);
      }

      if (
        members[i].party == "R" &&
        document.getElementById("republican").checked
      ) {
        filteredStateMembers.push(members[i]);
      }

      if (
        members[i].party == "I" &&
        document.getElementById("independent").checked
      ) {
        filteredStateMembers.push(members[i]);
      }

      if (
        !document.getElementById("democrat").checked &&
        !document.getElementById("republican").checked &&
        !document.getElementById("independent").checked
      ) {
        filteredStateMembers.push(members[i]);
      }
    }
  }
  if (filteredStateMembers.length == 0) {
    document.getElementById("table").innerHTML = "";

    var row = document.createElement("tr");

    var message = document.createElement("td");

    message.innerHTML = "No Results Matching.";

    row.append(message);

    document.getElementById("table").append(row);
  } else {
    createTable(filteredStateMembers);
  }
}

function loader() {
  document.getElementById("loader").style.display = "none";
}
