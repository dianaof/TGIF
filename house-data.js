//document.getElementById("house-data").innerHTML = JSON.stringify(data,null,2);

var houseMembers = data.results[0].members;

function createTable (list) {
    document.getElementById("house-table").innerHTML = ""
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
                     


        var houseParty = document.createElement ("td");
        houseParty.innerHTML = list[i].party;

        var houseSeniority = document.createElement ("td");
        houseSeniority.innerHTML = list[i].seniority;

        var houseState = document.createElement ("td");
        houseState.innerHTML = list[i].state;

        var percentageOfVotes = document.createElement ("td");
        percentageOfVotes.innerHTML = list[i].votes_with_party_pct + '%';

        newRow.append(fullName, houseParty, houseState, houseSeniority, percentageOfVotes);

        document.getElementById("house-table").appendChild(newRow);
    }

}

createTable(houseMembers);


document.getElementById("republican").addEventListener("click", partyClick);
document.getElementById("democrat").addEventListener("click", partyClick);
document.getElementById("independent").addEventListener("click", partyClick);



function partyClick () {
    var filteredMembers = []
    for (var i = 0; i < houseMembers.length; i++) {
       
        if (document.getElementById("democrat").checked && houseMembers[i].party == "D") {
            filteredMembers.push(houseMembers[i]);
           
        }
            
        if (document.getElementById("republican").checked && houseMembers[i].party == "R") {
            filteredMembers.push(houseMembers[i]);
           
        }

        if (document.getElementById("independent").checked && houseMembers[i].party == "I") {
            filteredMembers.push(houseMembers[i]);
           


        }
        
}
console.log(filteredMembers);

            if (filteredMembers.length == 0 && !document.getElementById("independent").checked && !document.getElementById("republican").checked && !document.getElementById("independent").checked) {
                // console.log("No checked");
                
                createTable(houseMembers);
            }else {
                // console.log("checked");
                createTable(filteredMembers);
            }
}

var dropdownList = document.getElementById("stateSelect");

function stateSelect() {
    
    var listStates = [];

    for (var i = 0; i < houseMembers.length; i++){   

        if (!listStates.includes(houseMembers[i])) {
            listStates.push(houseMembers[i].state);
        }
    }
    
    for (var i = 0; i < listStates.length; i++){
    
    var newOption = document.createElement("option"); // we create one option element

        newOption.innerHTML = listStates[i] // we make the value of the option quale to each value of our new container 
    
        dropdownList.appendChild(newOption); // we put the option in select

} }
stateSelect();