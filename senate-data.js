//document.getElementById("senate-data").innerHTML = JSON.stringify(data,null,2);

var senateMembers = data.results[0].members;

function createTable (list) {
     document.getElementById("senate-table").innerHTML = "";
    for (var i = 0; i < list.length; i++) {
        var newRow = document.createElement ("tr");
       
        var fullName = document.createElement ("td");
        // fullName.innerHTML = list[i].first_name;
        // fullName.innerHTML = list[i].middle_name;
        // fullName.innerHTML = list[i].last_name;

            if (list[i].middle_name == null) {
                fullName.innerHTML = list[i].first_name + " " + list[i].last_name;}
                
                else {
                    fullName.innerHTML = list[i].first_name + " "+ list[i].middle_name +  " "+ list[i].last_name;
                }
                     


        var senateParty = document.createElement ("td");
        senateParty.innerHTML = list[i].party;
        
        var senateState = document.createElement ("td");
        senateState.innerHTML = list[i].state;
        
        var senateSeniority = document.createElement ("td");
        senateSeniority.innerHTML = list[i].seniority;

        var percentageOfVotes = document.createElement ("td");
        percentageOfVotes.innerHTML = list[i].votes_with_party_pct  + '%';

        newRow.append(fullName, senateParty, senateState, senateSeniority, percentageOfVotes);

        document.getElementById("senate-table").appendChild(newRow);
    }

}

createTable(senateMembers);


document.getElementById("republican").addEventListener("click", partyClick);
document.getElementById("democrat").addEventListener("click", partyClick);
document.getElementById("independent").addEventListener("click", partyClick);


function partyClick () {
    var filteredMembers = [];
    for (var i = 0; i < senateMembers.length; i++) {
       
        if (document.getElementById("democrat").checked && senateMembers[i].party == "D") {
            filteredMembers.push(senateMembers[i]);
           
        }
            
        if (document.getElementById("republican").checked && senateMembers[i].party == "R") {
            filteredMembers.push(senateMembers[i]);
           
        }

        if (document.getElementById("independent").checked && senateMembers[i].party == "I") {
            filteredMembers.push(senateMembers[i]);
           
        }
        
    }
// console.log(filteredMembers);

            if (filteredMembers.length == 0 && !document.getElementById("independent").checked && !document.getElementById("republican").checked && !document.getElementById("independent").checked) {
                // console.log("No checked");
                
                createTable(senateMembers)
            }else {
                // console.log("checked");
                createTable(filteredMembers)
            }
}


var dropdownList = document.getElementById("stateSelect");

function stateSelect() {
    
    var listStates = [];
    
    for (var i = 0; i < senateMembers.length; i++){   

        if (!listStates.includes(senateMembers[i])) {
            listStates.push(senateMembers[i].state);
        }
        
    }
    //Hello people
    //sort array states
    for (var i = 0; i < listStates.length; i++){
    
    var newOption = document.createElement("option"); // we create one option element

        newOption.innerHTML = listStates[i] // we make the value of the option equale to each value of our new container 
    
        dropdownList.appendChild(newOption); // we put the option in select
     }
}

stateSelect();

document.getElementById("stateSelect").addEventListener("change", stateClick);

function stateClick() {
    
    var filteredStateMembers = [];

    for (var i = 0; i < senateMembers.length; i++) {

        filteredStateMembers.push(senateMembers[i]);
    }

}