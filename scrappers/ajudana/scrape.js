const puppeteer = require('puppeteer');
const fs = require('fs');

const fetchData = async (url, headers) => {
  const response = await fetch(url, { headers, method: 'GET' });
  return response.json();
};

require('dotenv').config();

const headers = {
  "accept": "*/*",
  "accept-language": "es-ES,es;q=0.9,de;q=0.8",
  "accept-profile": "public",
  "apikey": process.env.AJUDANA_API_KEY,
  "authorization": `Bearer ${process.env.AJUDANA_API_KEY}`,
  "priority": "u=1, i",
  "sec-ch-ua": "\"Chromium\";v=\"130\", \"Google Chrome\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site",
  "x-client-info": "supabase-js-web/2.46.1",
  "Referer": "https://ajudadana.es/",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

const getHelpRequestsNecesita = () => fetchData("https://nmvcsenkfqbdlfdtiqdo.supabase.co/rest/v1/help_requests?select=*&type=eq.necesita&order=created_at.desc", headers);

const getHelpRequestsOfrece = () => fetchData("https://nmvcsenkfqbdlfdtiqdo.supabase.co/rest/v1/help_requests?select=*&type=eq.ofrece&order=created_at.desc", headers);

const getCollectionPoints = () => fetchData("https://nmvcsenkfqbdlfdtiqdo.supabase.co/rest/v1/collection_points?select=*&order=created_at.desc", headers);

const getTowns = () => fetchData("https://nmvcsenkfqbdlfdtiqdo.supabase.co/rest/v1/towns?select=id%2Cname", headers);

getHelpRequestsNecesita().then(data => {
  fs.writeFileSync(__dirname + '/data/help_requests_necesita.json', JSON.stringify(data, null, 2));
});

getHelpRequestsOfrece().then(data => {
  fs.writeFileSync(__dirname + '/data/help_requests_offer.json', JSON.stringify(data, null, 2));
});

getCollectionPoints().then(data => {
  fs.writeFileSync(__dirname + '/data/collection_points.json', JSON.stringify(data, null, 2));
});

getTowns().then(data => {
  fs.writeFileSync(__dirname + '/data/towns.json', JSON.stringify(data, null, 2));
});