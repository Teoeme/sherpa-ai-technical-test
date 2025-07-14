//Descargar manuscrito si esta desbloqueado

import { MScrapper } from "../scrapper";
import fs from 'fs/promises';

type possibleCentury = 'XIV' | 'XV' | 'XVI' | 'XVII' | 'XVIII';

const checkIfIsInPortal = async () => {
    const scrapper = await MScrapper.getInstance();
    if(scrapper.currentPage.url() !== 'https://pruebatecnica-sherpa-production.up.railway.app/portal'){
        return false;
    }
    return true;
}


export const tryToDownloadManuscript = async (century: possibleCentury,accessCode: string|null): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const scrapper = await MScrapper.getInstance();
        if(!await checkIfIsInPortal()){
            throw new Error('You are not in the portal');
        }
        
        
        const centurySelector = `select`;
        await scrapper.changeSelect(centurySelector, century);
        
        
        const manuscriptTitle = await scrapper.getText('h3') || '';
        const password = await handleSpecialCase(century,manuscriptTitle);
        
        if(accessCode !== null && !password){
            if(!await handleAccessCode(accessCode)){
                throw new Error('Access code is incorrect');
            }
        }
        
        const downloadButton = await scrapper.getText('button');
        switch(downloadButton){
            case 'Descargar PDF':
                const clickLoop= setInterval(async () => {
                    await scrapper.clickButton('button');
                }, 1000);
             
                scrapper.currentPage.once('download', async (download:any)=>{
                    await download.saveAs(`${process.cwd()}/temp/manuscripts/${century}.pdf`);
                    console.log(`Manuscrito ${manuscriptTitle} descargado -> ${century}.pdf`);
                    clearInterval(clickLoop);
                    resolve(manuscriptTitle);
                });
                
                break;

            case 'Descargado':
                resolve(manuscriptTitle);
                break;

            default:
                reject(new Error('Error downloading manuscript'));
            }
        });
    }
            
const handleAccessCode = async (accessCode: string) => {
    const scrapper = await MScrapper.getInstance();
    
    if(!await checkIfIsInPortal()){
        throw new Error('You are not in the portal');
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    const accessCodeInput = await scrapper.fillInput('input[placeholder="Ingresá el código"]', accessCode);

    await new Promise(resolve => setTimeout(resolve, 500));

    if(accessCodeInput === undefined){
        const alreadyUnlocked = scrapper.currentPage.getByText('Desbloqueado');
        if(!alreadyUnlocked){
            return false;
        }
    }else{
        //click en desbloquear
        await scrapper.clickButton('button[type="submit"] span:text("Desbloquear")').catch(err => console.log('Error clicking the button Desbloquear', err));
        
        //manejar ventana emergente si la hay
        await scrapper.clickButton('button[aria-label="Cerrar modal"]')
        await new Promise(resolve => setTimeout(resolve, 500));
    }
        console.log(`Manuscrito desbloqueado.`);
        return true;
}

export const getAccessCodeFromManuscript = async (century: possibleCentury) => {
    console.log(`Buscando código de acceso en el manuscrito.`);
    const getFile = await fs.readFile(`${process.cwd()}/temp/manuscripts/${century}.pdf`, 'utf8');

    const completedChallenge=getFile.match(/DESAFÍO COMPLETADO/);
    if(completedChallenge){   
        console.warn(`\n--- DESAFÍO COMPLETADO: FIN DE LA PRUEBA --- ✅`);
        process.exit(0);
    }

    const accessCode = getFile.match(/Código de acceso: (\w+)/)?.[1];
    if(!accessCode){
        throw new Error('Access code not found');
    }
    console.log(`Código de acceso encontrado: ${accessCode}`);
    return accessCode;
}

let processedManuscripts: {[key:string]:{manuscriptTitle?:string,accessCode?:string}} = {};

export const processAllManuscripts = async () => {

    const centuries: possibleCentury[] = ['XIV','XV','XVI','XVII','XVIII'];

    for(let i = 0; i < centuries.length; i++){
        const century = centuries[i];
        const manuscriptTitle = await tryToDownloadManuscript(century, processedManuscripts[centuries[i]]?.accessCode || null);
        const accessCode = await getAccessCodeFromManuscript(century);
        processedManuscripts[century] = { ...processedManuscripts[century], manuscriptTitle }; 
        
        if (i + 1 < centuries.length) {
            processedManuscripts[centuries[i+1]] = {accessCode};
        }
        console.log(`\n`);
    }

}

const handleSpecialCase=async (currentCentury: possibleCentury,manuscriptTitle:string):Promise<string|false>=>{
    const scrapper = await MScrapper.getInstance();
    if(!await scrapper.currentPage.$('button:text("Ver documentación")')){
        return false;
    }

    await scrapper.clickButton('button:text("Ver documentación")');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const httpEndpoint= await scrapper.currentPage.$('pre').then(el => el?.textContent());
    
    try{
        const accessCode=processedManuscripts[currentCentury]?.accessCode;
        const response = await fetch(`${httpEndpoint}?bookTitle=${manuscriptTitle}&unlockCode=${accessCode}`).then(res => res.json());
        const password = await handleChallenge(response.challenge);

        //Ventanas emergentes

        //cerrar modal
        await scrapper.clickButton('button[aria-label="Cerrar modal"]');
        await new Promise(resolve => setTimeout(resolve, 1000));

        await handleAccessCode(password);

        return password;
        
    }catch(err){
        throw new Error('Error fetching the http endpoint');
    }

}


const handleChallenge=async (challenge:any)=>{
    console.log(`➤ Resolviendo desafío del challenge: ${challenge?.bookTitle}`)
    const {vault,targets}=challenge;
    const password = targets.map((target:number) => binarySearch(vault, target));
    const passwordString = password.join('');
    console.log(`La contraseña del challenge es: ${passwordString} `);
    return passwordString;

}

const binarySearch = (arr: any[], target: number): any => {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      if (mid === target) {
        return arr[mid]; // Encontramos el índice
      } else if (mid < target) {
        left = mid + 1; // Buscar en la mitad derecha
      } else {
        right = mid - 1; // Buscar en la mitad izquierda
      }
    }
    
    return null; // No encontrado
  }
