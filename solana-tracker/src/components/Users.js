import React, { useEffect, useState } from "react";
import axios from 'axios';
export default function Users() {
    let data,i=0;
    
    const user_id=[]
    const [Hero_User, updated_user] = useState([]);
    const [Purchased, updated_purchased] = useState([]);
        const apiCalls = () => {
            if(!user_id[i])return;
            const options = {
            method: 'POST',
            url: `https://api.solana.fm/v1/tokens/${user_id[i]}/token-accounts`,
            headers: {accept: 'application/json', 'content-type': 'application/json'},
            data: {
              includeSolBalance: true
            }
          };
          
          axios.request(options).then(function (response) {
              if(response.data.tokenAccounts.length==1 && response.data.tokenAccounts[0].info.mint=='64GhPSS8P8wNaGWH2uysASxp9XYsqS3An3eJ3w5YNJK9'){
                    updated_user(prev => [
                    
                      ...prev,
                      {owner: user_id[i],
                      solana: response.data.solBalance,
                      hero: response.data.tokenAccounts[0].info.tokenAmount.amount
                    }])
              }
            })
            .catch(function (error) {
               console.error("Error");
            });
            i++;
            if(i==1000)i=0;
    }
    const recheck_users  = () => {
        for(let j=0;j<Hero_User.length;j++){
            const options = {
                method: 'POST',
                url: `https://api.solana.fm/v1/tokens/${Hero_User[j].owner}/token-accounts`,
                headers: {accept: 'application/json', 'content-type': 'application/json'},
                data: {
                  includeSolBalance: true
                }
              };
              
              axios.request(options).then(function (response) {
                  if(response.data.solBalance>Hero_User[j].solana){
                    updated_purchased(prev => [
                    
                        ...prev,
                        {owner: Hero_User[j].owner,
                        solana: response.data.solBalance,
                        hero: response.data.tokenAccounts[0].info.tokenAmount.amount
                      }])
                      Hero_User[j].solana=response.data.solBalance;
                  }
                })
                .catch(function (error) {
                   console.error("Error");
                });
        }
    }
useEffect (()=>{
    const options2 = {
        method: 'GET',
        url: 'https://api.solana.fm/v1/tokens/64GhPSS8P8wNaGWH2uysASxp9XYsqS3An3eJ3w5YNJK9/holders?pageSize=1000',
        headers: {accept: 'application/json'}
      };
      
      axios
        .request(options2)
        .then(function (response) {
            data=response.data;
            for(let i=0; i<data.tokenAccounts.length;i++){
                user_id.push(data.tokenAccounts[i].info.owner)
            }
        })
        .catch(function (error) {
           
        })
    },[]);   
        setTimeout(function(){
            setInterval(apiCalls,500);
        },5000); 
        setInterval(recheck_users,100000);     
    return(
       <>
       <div className="header">
       <h1> List of Users who transact with Hero token only.</h1>
       <h1> List of Users who just bought solana.</h1>
       </div>
       <div className="main-box">
       <table>
      <thead>
        <tr>
          <th>Owner</th>
          <th>Solana</th>
          <th>Hero Token</th>
        </tr>
      </thead>
      <tbody>
        {Hero_User.map((item) => (
          <tr>
            <td>{item.owner}</td>
            <td>{item.solana}</td>
            <td>{item.hero}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <table>
      <thead>
        <tr>
          <th>Owner</th>
          <th>Solana</th>
          <th>Hero Token</th>
        </tr>
      </thead>
      <tbody>
        {Purchased.map((item) => (
          <tr>
            <td>{item.owner}</td>
            <td>{item.solana}</td>
            <td>{item.hero}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
       </>

    );
}