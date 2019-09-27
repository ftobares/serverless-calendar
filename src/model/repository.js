import axios from "axios";

const baseDomain = "https://9hjex8oc9b.execute-api.us-east-1.amazonaws.com/prod";
const baseURL = `${baseDomain}/v1`;

export default axios.create({
    baseURL,
    ///headers:{ "Authorization":"token"}
});