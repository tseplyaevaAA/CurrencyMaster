
const apiKey = 'bf44fe60-725b-11ec-b846-ebcc2b7fa749';

const ApiType = {
  Latest: 'latest',
};

const axios = require('axios');

class CMServerHelper {

  getBaseURL() {
    return 'https://freecurrencyapi.net/api/v2/';
  }

  async fetchCurrencies() {
    let request = this.getBaseURL() + ApiType.Latest + '?apikey=' + apiKey;
    return axios.get(request)
      .then(response => {
        if (response.status == 200) {
          return response.data;
        } else return [];
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  }
}

const cmServerHelper = new CMServerHelper();
export default cmServerHelper;
