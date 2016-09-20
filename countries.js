const countries = require('world-countries');

const countryNames = countries.reduce((prev, country) => {
  let names = {};

  let key = country.cca2;
  let name = country.name;
  let trans = country.translations;

  function addName(val) {
    if (val) names[val.trim()] = key;
  }

  addName(name.common);
  addName(name.official);

  for (let lang in name.native) {
    addName(name.native[lang].common);
    addName(name.native[lang].official);
  }

  for (let lang in trans) {
    addName(trans[lang].common);
    addName(trans[lang].official);
  }

  return Object.assign(prev, names);
}, {});

const countryTrie = Object.keys(countryNames).sort()
.reduce((trie, currentName, i, sortedNames) => {
  var cursor = trie;
  const nextName = sortedNames[i + 1];
  var path = '';

  // find the intersection between the currentName and nextName
  for (let j = 0, n = currentName.length, intersection = ''; j < n; j++) {

    var remainder = intersection.replace(path, '');

    if (cursor[remainder]) {
      cursor = cursor[remainder];
      path += remainder;
    }

    intersection += currentName[j];

    if (nextName && !nextName.startsWith(intersection)) {
      var nextKey = intersection.slice(0, -1).replace(path, '');
      cursor[nextKey] = {[currentName.replace(intersection, '')]: countryNames[currentName]};
      return trie;
    }
  }

  cursor[currentName.replace(path, '')] = {'$': countryNames[currentName]};
  return trie;
}, {});

//console.log(JSON.stringify(Object.keys(countryNames).sort()));

console.log(JSON.stringify(countryTrie, null, '  '));
