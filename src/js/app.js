App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('BloqToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var BloqTokenArtifact = data;
      App.contracts.BloqToken = TruffleContract(BloqTokenArtifact);

      // Set the provider for our contract.
      App.contracts.BloqToken.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      App.getStatus();
      return App.getBalances();
	});
    
    $.getJSON('Whitelist.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var WhitelistArtifact = data;
      App.contracts.Whitelist = TruffleContract(WhitelistArtifact);

      // Set the provider for our contract.
      App.contracts.Whitelist.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets.
      return App.getTiers();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#updateTierButton', App.updateTier);
    $(document).on('click', '#pause', App.pause);
    $(document).on('click', '#unpause', App.unpause);
  },

  handleTransfer: function(event) {
    event.preventDefault();

    var amount = parseInt($('#BTTransferAmount').val());
    var toAddress = $('#BTTransferAddress').val();

    console.log('Transfer ' + amount + ' BT to ' + toAddress);

    var BloqTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.BloqToken.deployed().then(function(instance) {
        BloqTokenInstance = instance;

        return BloqTokenInstance.transfer(toAddress, amount, {from: account});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  updateTier: function(event) {
    event.preventDefault();

    var tier = parseInt($('#BTWhitelistTier').val());
    var addr = $('#BTWhitelistAddress').val();

    console.log('Set tier of ' + addr + ' to ' + tier);

    var WhitelistInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Whitelist.deployed().then(function(instance) {
        WhitelistInstance = instance;

        return WhitelistInstance.updateTier(addr, tier, {from: account});
      }).then(function(result) {
        alert('Tier update successful!');
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  pause: function(event) {
    event.preventDefault();

    console.log("Pause contract");
    
    App.contracts.BloqToken.deployed().then(function(instance) {
        return instance.pause();
      }).then(function(result) {
        alert('Status update successful!');
        $('#BTPause').text("Please refresh");
      }).catch(function(err) {
        console.log(err.message);
    });
  },
  
  unpause: function(event) {
    event.preventDefault();

    console.log("Pause contract");
    
	App.contracts.BloqToken.deployed().then(function(instance) {
		return instance.unpause();
	  }).then(function(result) {
		alert('Status update successful!');
		$('#BTPause').text("Please refresh");
	  }).catch(function(err) {
		console.log(err.message);
	});
  },

  getBalances: function(adopters, account) {
    console.log('Getting balances...');

    var BloqTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.BloqToken.deployed().then(function(instance) {
        BloqTokenInstance = instance;

        return BloqTokenInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];

        $('#BTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  
  getStatus: function() {
    console.log('Getting status...');

	App.contracts.BloqToken.deployed().then(function(instance) {
        return instance.paused.call();
      }).then(function(status) {
        $('#BTPause').text(status);
      }).catch(function(err) {
        console.log(err.message);
	});
  },

  getTiers: function(adopters, account) {
    console.log('Getting tierlevel...');

    var whitelistInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Whitelist.deployed().then(function(instance) {
        whitelistInstance = instance;

        return whitelistInstance.tierOf(account);
      }).then(function(result) {
        tier = result.c[0];

        $('#BTTier').text(tier);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
