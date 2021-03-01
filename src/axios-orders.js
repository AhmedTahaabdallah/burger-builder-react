import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://europe-west3-burger-builder-react-eb8cd.cloudfunctions.net'
});

// instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// instance.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS';
// instance.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Content-Type, X-Auth-Token';

export default instance;