import { checkAgentLimit } from "../config/agentRateLimit.js";
import { deductCredits } from "../utils/deductCredits.js";
import { searchTool } from "../utils/tavily.js";



export const searchAgent =
async(state)=>{
//await checkAgentLimit(
    //state.userId,
    //"search"
  //);
  //await deductCredits(

      //  state.userId,

        //"search"

    //); 
 try{

  const results =
  await searchTool.invoke({

 query:state.prompt

} );
const allowedDomains = [
  "reuters.com",
  "bbc.com",
  "espn.com",
  "gettyimages.com",
  "olympics.com",
  "fifa.com",
  "nba.com",
  "formula1.com",
  "icc-cricket.com",
  "bcci.tv",
  "thehindu.com",
  "indiatoday.in",
  "ndtv.com",
  "hindustantimes.com",
  "sportstar.thehindu.com"
];

const safeImages = (results.images || []).filter((url) =>
  allowedDomains.some((domain) => url.includes(domain))
);

console.log("Full Results:", results);
console.log("Images:", results.images);

  return {

   ...state,

   searchResults:
   results,
   

  };

 }catch(error){

  console.log(error);

  return {

   ...state,

   searchResults:[]

  };

 }

};