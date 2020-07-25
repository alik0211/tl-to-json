class Parser {
  constructor(raw) {
    this.lines = raw.toString().split('\n');

    this.mode = 'constructors';

    this.constructors = [];
    this.methods = [];

    this.parse();
  }

  parse() {
    const { lines } = this;

    lines.forEach((line) => {
      line = line.replace(';', '').trim();

      if (line === '' || line.indexOf('//') === 0) {
        return;
      }

      this.parseLine(line);
    });
  }

  parseLine(line) {
    if (line === '---functions---') {
      this.mode = 'methods';

      return;
    }

    if (this.mode === 'constructors') {
      return this.parseConstructor(line);
    }

    if (this.mode === 'methods') {
      return this.parseMethod(line);
    }

    throw Error(`Mode ${this.mode} is not support`);
  }

  parseConstructor(line) {
    const splitedLine = line.split('=');

    const body = splitedLine[0].trim();
    const type = splitedLine[1].trim();

    const [predicateWithId, ...paramsAsArray] = body.split(' ');

    const [predicate, idAsString] = predicateWithId.split('#');
    const id = parseInt(idAsString, 16);

    const isVector = predicate === 'vector';

    const params = isVector
      ? []
      : paramsAsArray.map((param) => {
          const [paramName, paramType] = param.split(':');

          return {
            name: paramName,
            type: paramType,
          };
        });

    this.constructors.push({
      id,
      predicate,
      params,
      type,
    });
  }

  parseMethod(line) {
    const splitedLine = line.split('=');

    const body = splitedLine[0].trim();
    const type = splitedLine[1].trim();

    const [predicateWithId, ...paramsAsArray] = body.split(' ');

    const [method, idAsString] = predicateWithId.split('#');
    const id = parseInt(idAsString, 16);

    const params = paramsAsArray
      .filter((param) => {
        if (param[0] === '{' && param[param.length - 1] === '}') {
          return false;
        }

        return true;
      })
      .map((param) => {
        const [paramName, paramType] = param.split(':');

        return {
          name: paramName,
          type: paramType,
        };
      });

    this.methods.push({
      id,
      method,
      params,
      type,
    });
  }

  getJS() {
    const { constructors, methods } = this;

    return { constructors, methods };
  }

  getJSON() {
    return JSON.stringify(this.getJS());
  }
}

module.exports = { Parser };
