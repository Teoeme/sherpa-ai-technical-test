
//Iniciar el scrapper

import { MScrapper } from "./scrapping/scrapper";
import { loginInCrypt } from "./scrapping/useCase/login";
import {processAllManuscripts} from "./scrapping/useCase/handleManuscripts";
import fs from 'fs/promises';
async function main() {
    //limpiar todos los archivos de la carpeta temp
    await fs.rm(`${process.cwd()}/temp`, {recursive: true}).catch(()=>{});

    await loginInCrypt('monje@sherpa.local', 'cript@123');
    await processAllManuscripts();

}

main().catch(async (error)=>{
    console.log(error);
    // await fs.rm(`${process.cwd()}/temp`, {recursive: true}).catch(()=>{});
    process.exit(1);
    
});
