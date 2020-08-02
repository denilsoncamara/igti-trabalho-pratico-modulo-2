import { promises as fs, read } from 'fs';
import readline from 'readline';

async function init() {
  writeFilesJSON();

  getNumberCitiesOfState();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function writeFilesJSON() {
  const states = JSON.parse(await fs.readFile('estados.json'));
  const cities = JSON.parse(await fs.readFile('cidades.json'));

  states.forEach(uf => {
    const mapCityState = cities.filter(city => {
      return city.Estado === uf.ID;
    });

    fs.writeFile(`./states/${uf.Sigla}.json`, JSON.stringify(mapCityState, null, 2));
  });
}

async function getQuantityStateCities(uf) {
  const stateCities = JSON.parse(await fs.readFile(`./states/${uf}.json`));

  return stateCities.length;
}

async function getNumberCitiesOfState() {
  rl.question("Informe a UF do estado: ", async uf => {
    if (uf === 'sair') {
      rl.close();
      return;
    }

    const numberOfCities = await getQuantityStateCities(uf);
    
    console.log(`Quantidade de cidades de ${uf.toUpperCase()}:`, numberOfCities);
    
    await getStatesCities();
  });
}

async function getStatesCities() {
  let getQuantityCities = 0;
  const statesQuantityCities = [];

  const states = JSON.parse(await fs.readFile(`estados.json`));
  
  for (const state of states){
    getQuantityCities = await getQuantityStateCities(state.Sigla);
    statesQuantityCities.push(`${state.Sigla} - ${getQuantityCities}`);
  }

  orderedStatesCities(statesQuantityCities);
}

function orderedStatesCities(stateCities) {
  let resultASC = stateCities.sort((a, b) => {
    return b.split(' - ')[1] - a.split(' - ')[1]
  }).slice(0, 5);

  console.log('Os cinco estados que mais possuem cidades: \n', resultASC);

  let resultDESC = stateCities.sort((a, b) => {
    return a.split(' - ')[1] - b.split(' - ')[1]
  }).slice(0, 5);

  console.log('Os cinco estados que menos possuem cidades: \n', resultDESC);

  getCitiesWithMoreName();
}

async function getCitiesWithMoreName() {
  const citiesWithMoreName = [];

  const states = JSON.parse(await fs.readFile(`estados.json`));

  for (const state of states) {
    const cities = JSON.parse(await fs.readFile(`./states/${state.Sigla}.json`));
    let biggestName = cities[0].Nome;

    cities.forEach(({ Nome: nome }) => {
      if (nome.length > biggestName.length) {
        biggestName = nome;
      }
    });
    citiesWithMoreName.push(`${biggestName} - ${state.Sigla}`);
  }

  console.log('Cidade de maior nome de cada estado: \n', citiesWithMoreName);

  getCitiesWithLessName();

  biggestNameCity(citiesWithMoreName);
}

async function getCitiesWithLessName() {
  const citiesWithLessName = [];

  const states = JSON.parse(await fs.readFile(`estados.json`));

  for (const state of states) {
    const cities = JSON.parse(await fs.readFile(`./states/${state.Sigla}.json`));
    let smallestName = cities[0].Nome;

    cities.forEach(({ Nome: nome }) => {
      if (nome.length < smallestName.length) {
        smallestName = nome;
      }
    });
    citiesWithLessName.push(`${smallestName} - ${state.Sigla}`);
  }

  console.log('Cidade de menor nome de cada estado: \n', citiesWithLessName);
  
  smallestCity(citiesWithLessName);
}

async function biggestNameCity(cities) {
  cities = cities.sort((a, b) => a.localeCompare(b));

  let biggestName = cities[0];
  cities.forEach(city => {
    if (city.length > biggestName.length) {
      biggestName = city;
    }
  });

  console.log('A cidade de maior nome é:', biggestName);
}

async function smallestCity(cities) {
  cities = cities.sort((a, b) => a.localeCompare(b));

  let smallestName = cities[0];
  cities.forEach(city => {
    if (city.length < smallestName.length) {
      smallestName = city;
    }
  });

  console.log('A cidade de menor nome é: ', smallestName);
}

init();