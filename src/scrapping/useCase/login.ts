import { MScrapper } from "../scrapper";


export const loginInCrypt = async ( email: string, password: string) => {
const scrapper = await MScrapper.getInstance();
await scrapper.goToPage('https://pruebatecnica-sherpa-production.up.railway.app/login');

await scrapper.fillInput('#email', email);
await scrapper.fillInput('#password', password);
await scrapper.clickButton('button[type="submit"]');

}
