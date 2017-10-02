import * as _ from 'lodash';

export class UtilsService {
  private static _instance: UtilsService;

  static createInstance() {
    UtilsService.getInstance();
  }

  static getInstance() {
    return this._instance || (this._instance = new this());
  }

  parseTemplate(template: string, data: any) {
    _.templateSettings.interpolate = /:([a-zA-Z0-9]*)/g;
    let compiled = _.template(template);
    return compiled(data);
  }

  objectToArray(obj: any) {
    let arr = [];
    Object.keys(obj).forEach(key => {
      arr.push({
        attribute: key,
        value: obj[key]
      });
    });

    return arr;
  }

  parseUrl(endpoint: string, data: any) {
    //split endpoint in two
    let templateData = _.cloneDeep(data);
    let splitEndpoint = endpoint.split('?');
    let paramsEndpoint = splitEndpoint[0];
    let queryEndpoint = splitEndpoint[1];

    //parse params like /entity/:id
    try {
      paramsEndpoint = this.parseTemplate(paramsEndpoint, templateData);
    } catch (e) {
      console.log(e);
    }

    const isString = str =>
      isNaN(str) ? str && str.indexOf('"') !== -1 : false;

    _.forOwn(templateData, (value, key) => {
      if (_.isArray(value)) {
        templateData[key] = value
          .map(
            item =>
              _.isString(item) && isNaN(item as any) ? `"${item}"` : item
          )
          .join(`&${key}[]=`);
      } else {
        templateData[key] =
          _.isString(value) && _.isNaN(value) ? `"${value}"` : value;
      }
    });

    if (queryEndpoint) {
      queryEndpoint = this.parseTemplate(queryEndpoint, templateData);
      return `${paramsEndpoint}?${queryEndpoint}`;
    }

    return paramsEndpoint;
  }
}
