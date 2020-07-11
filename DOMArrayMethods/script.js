let personList = [];

getRandomUser();
getRandomUser();
getRandomUser();

async function getRandomUser() {
    const result = await fetch('https://randomuser.me/api');
    const data = await result.json();
    const person = {
        name : data.results[0].name.first + ' ' + data.results[0].name.last,
        wealth : Math.floor(Math.random() * 1000000)
    }
    addPersonToList(person);
}

addPersonToList = (person) => {
    personList.push(person);
    updateDOM(personList);
}

updateDOM = (personList = list) => {
    mainDOM.innerHTML = '<h2><strong>Person</strong> Wealth</h2>';
    personList.forEach(element => {
        mainDOM = document.querySelector('main');
        let nameDOM = document.createElement('div');
        nameDOM.innerHTML = '<strong>' + element.name + '</strong>' + '$' + element.wealth.toLocaleString('en-US');
        nameDOM.setAttribute('class', 'person');
        mainDOM.appendChild(nameDOM);
    });
}

doubleWealth = () => {
    personList.map((person) => {
        return person.wealth = person.wealth * 2;
    })
    updateDOM(personList);
}

showMillionares = () => {
    let filteredList = personList.filter(person => person.wealth > 1000000);
    updateDOM(filteredList);
}

sortByWealth =  () => {
    personList.sort((p1,p2) => {
        return p1.wealth - p2.wealth;
    });
    updateDOM(personList);
}

calculateWealth = () => {
    const totalWealth = personList.reduce((sum,person) => {
         return sum + person.wealth;
    },0)

    console.log(totalWealth);

   let totalDOM = document.createElement('div');
   totalDOM.innerHTML = '<h3>Total Wealth: <strong>$'+ totalWealth.toLocaleString('en-US') +'</strong></h3>';
   mainDOM.appendChild(totalDOM);
}

let mainDOM = document.querySelector('main').innerHTML;

document.getElementById("add-user").addEventListener("click", getRandomUser);
document.getElementById("double").addEventListener("click", doubleWealth);
document.getElementById("show-millionaires").addEventListener("click", showMillionares);
document.getElementById("sort").addEventListener("click", sortByWealth);
document.getElementById("calculate-wealth").addEventListener("click", calculateWealth);

