import "../stylesheets/app.css";
import {  default as Web3 } from 'web3';
import {  default as contract } from 'truffle-contract';

import conference_artifacts from '../../build/contracts/Conference.json'

var accounts, sim;
var Conference = contract(conference_artifacts);



window.addEventListener('load', function() {
	//alert("aaaaa");
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    Conference.setProvider(web3.currentProvider);
    App.start();

    $("#changeQuota").click(function() {
        var newquota = $("#confQuota").val();
        App.changeQuota(newquota);
    });

    // Wire up the UI elements
});

window.App = { //where to close
    start: function() {
        var self = this;

        web3.eth.getAccounts(function(err, accs) {
            if (err != null) {
                alert("There was an error fetching your accounts.");
                return;
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }
 accounts = accs;
//$("#tentantAddress").html(getBalance(accounts[0])); //prints balance

            //console.log(accounts);
            self.initializeConference();
        });
    },

    initializeConference: function() {
        var self = this;
	
        Conference.deployed().then(function(instance) {
            sim = instance;
            $("#confAddress").html(sim.address);

            self.checkValues();
        }).catch(function(e) {
            console.log(e);
        });

    },




checkValues: function() {

        Conference.deployed().then(function(instance) {
           sim = instance;
	    console.log(sim);	
            sim.quota.call().then( 
            function(quota) { 
            console.log(quota); 
            $("input#confQuota").val(quota);
            return sim.organizer.call();
              }).then(
              function(organizer){
                $("input#confOrganizer").val(organizer);
                return sim.numRegistrants.call();
              }).then(
              function(num){
                $("#numRegistrants").html(num.toNumber());
              });
	
	});
   },

   changeQuota: function(newquota){
        Conference.deployed().then(function(instance) {
           sim = instance;
        console.log(sim);   
            sim.changeQuota(newquota,{from:accounts[0],gas:3000000}).then( 
            function() {
                return sim.quota.call(); 
              }).then(
              function(quota){
                var msgResult;
                if(quota == newquota){
                    msgResult = "change sucessful";

                }else{
                    msgResult = "change failed";

                }
                
                $("#changeQuotaResult").html(msgResult);
              });
    
    });
   }
};//loop for main