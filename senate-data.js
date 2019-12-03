//document.getElementById("senate-data").innerHTML = JSON.stringify(data,null,2);

var senateMembers;

fetch ("https://api.propublica.org/congress/v1/113/senate/members.json",{

method: "GET",
headers: {
    'X-API-key': 'USiTg4aV1o26w6EjIpr190WMQ6HdnmD1gael0wFG'
}}).then(function (response) {

    if (response.ok) {
        console.log(response);
        return response.json();
    }

    throw new Error(response.statusText);
}).then(function (json) {

    senateMembers = json.results[0].members;
        
        loader();
        createTable(senateMembers);
        stateSelect();
        

    console.log(senateMembers);

}).catch(function (error) {

    console.log("Request failed: " + error.message);
});

console.log(senateMembers);

//var senateMembers = data.results[0].members;


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

// createTable(senateMembers);


document.getElementById("republican").addEventListener("click", stateClick);
document.getElementById("democrat").addEventListener("click", stateClick);
document.getElementById("independent").addEventListener("click", stateClick);


// function partyClick () {
//     var filteredMembers = [];
//     for (var i = 0; i < senateMembers.length; i++) {
       
//         if (document.getElementById("democrat").checked && senateMembers[i].party == "D") {
//             filteredMembers.push(senateMembers[i]);
           
//         }
            
//         if (document.getElementById("republican").checked && senateMembers[i].party == "R") {
//             filteredMembers.push(senateMembers[i]);
           
//         }

//         if (document.getElementById("independent").checked && senateMembers[i].party == "I") {
//             filteredMembers.push(senateMembers[i]);
           
//         }
        
//     }
// // console.log(filteredMembers);

//             if (filteredMembers.length == 0 && !document.getElementById("independent").checked && !document.getElementById("republican").checked && !document.getElementById("independent").checked) {
//                 // console.log("No checked");
                
//                 createTable(senateMembers)
//             }else {
//                 // console.log("checked");
//                 createTable(filteredMembers)
//             }
// }


var dropdownList = document.getElementById("stateSelect");

function stateSelect() {
    
    var listStates = [];
    
    for (var i = 0; i < senateMembers.length; i++){   

        if (!listStates.includes(senateMembers[i].state)) {
            listStates.push(senateMembers[i].state);
        }
        
    }
    //Hello people
    listStates.sort();

    for (var i = 0; i < listStates.length; i++){
    
    var newOption = document.createElement("option"); // we create one option element

        newOption.innerHTML = listStates[i] // we make the value of the option equale to each value of our new container 
    
        dropdownList.appendChild(newOption); // we put the option in select
     }
}

//stateSelect();

document.getElementById("stateSelect").addEventListener("change", stateClick);

function stateClick() {
    
    var filteredStateMembers = [];

    var dropdownList = document.getElementById("stateSelect");

    for (var i = 0; i < senateMembers.length; i++) {

        if (senateMembers[i].state == dropdownList.value || dropdownList.value == "All"){

            if (senateMembers[i].party == "D" && document.getElementById("democrat").checked){
                filteredStateMembers.push(senateMembers[i]);
            }

            if (senateMembers[i].party == "R" && document.getElementById("republican").checked){
                filteredStateMembers.push(senateMembers[i]);
            }
               
            if (senateMembers[i].party == "I" && document.getElementById("independent").checked){
                filteredStateMembers.push(senateMembers[i]);   
            }

            if (!document.getElementById("democrat").checked && !document.getElementById             ("republican").checked && !document.getElementById("independent").checked){
                filteredStateMembers.push(senateMembers[i]);  
            }
        }
   
    }
    if (filteredStateMembers.length == 0) {
        document.getElementById("senate-table").innerHTML = "";
        
        var row = document.createElement ("tr");
        
        var message = document.createElement ("td");
       
        message.innerHTML = "No Results Matching."
       
        row.append(message);
       
        document.getElementById("senate-table").appendChild(row);
    }   
        else {
        createTable(filteredStateMembers);
        }                                       
}
// stateClick();

// var overlay = document.getElementById("overlay");

// window.addEventListener('load', function(){
//   overlay.style.display = 'none';
// })

function loader() {
    document.getElementById("loader").style.display = "none";
}

