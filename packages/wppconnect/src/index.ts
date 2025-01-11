import { start } from './receive ';

export  function connect (client:any,sessionName:string){
  start(client,sessionName);
}
