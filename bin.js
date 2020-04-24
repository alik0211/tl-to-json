#!/usr/bin/env node
const fs = require('fs').promises;
const { Parser } = require('./index');

const [nodePath, thisFile, tlFile, jsonFile] = process.argv;

fs.readFile(tlFile).then((fileContent) => {
  const parser = new Parser(fileContent);

  const json = parser.getJSON();

  fs.writeFile(jsonFile, json).then(() => {
    console.log(
      `Success convert ${parser.constructors.length} constructors and ${parser.methods.length} methods from TL to JSON`
    );
  });
});
