// Specifically request an abstraction for MetaCoin
var BloqToken = artifacts.require("BloqToken");

contract('BloqToken', function(accounts) {
  it("should put 1000 tokens in the first account", function() {
    return BloqToken.deployed().then(function(instance) {
      return instance.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 1000, "1000 wasn't in the first account");
    });
  });
  it("should send token correctly to whitelisted address (tier 1)", function() {
    var token;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return BloqToken.deployed().then(function(instance) {
      token = instance;
      return token.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return token.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return token.transfer(account_two, amount, {from: account_one});
    }).then(function() {
      return token.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return token.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance - amount, "Amount wasn't correctly taken from the sender");
      assert.equal(account_two_ending_balance, account_two_starting_balance + amount, "Amount wasn't correctly sent to the receiver");
    });
  });
  it("should not be able to send token to a non-whitelisted address", function() {
    var token;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[3];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return BloqToken.deployed().then(function(instance) {
      token = instance;
      return token.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return token.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return token.transfer(account_two, amount, {from: account_one});
    }).then(function(result, err) {
      return token.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return token.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance, "Balance of sender was updated");
      assert.equal(account_two_ending_balance, account_two_starting_balance, "Balance of receiver was updated");
    });
  });
  it("owner should be able to transfer tokens using transferFromByOwner", function() {
    var token;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];
    var amount1 = 10;
    var amount2 = 6;
    
    var account_two_starting_balance;
    var account_two_ending_balance;

    return BloqToken.deployed().then(function(instance) {
      token = instance;
      return token.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return token.transfer(account_two, amount1, {from: account_one});
    }).then(function() {
      return token.transferFromByOwner(account_two, account_one, amount2, {from: account_one});
    }).then(function() {
      return token.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_two_starting_balance + (amount1 - amount2), account_two_ending_balance, "TransferByOwner (or Transfer) failed");
    });
  });
  it("non-owner should not be able to transfer tokens using transferFromByOwner", function() {
    var token;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];
    var account_three = accounts[2];
    var amount1 = 10;
    var amount2 = 6;
    
    var account_two_starting_balance;
    var account_two_ending_balance;

    return BloqToken.deployed().then(function(instance) {
      token = instance;
      return token.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return token.transfer(account_two, amount1, {from: account_one});
    }).then(function() {
      return token.transferFromByOwner(account_two, account_one, amount2, {from: account_three});
    }).then(function() {
      return token.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_two_starting_balance + amount1, account_two_ending_balance, "TransferByOwner was executed by a non-owner account");
    });
  });
  it("Non-owner should NOT be able to pause the contract", function() {
	var token;
    return BloqToken.deployed().then(function(instance) {
	  token = instance;
      return token.pause({from: accounts[1]});
    }).then(function() {
	  return token.paused.call({from: accounts[1]});
    }).then(function(status) {
      assert.equal(status, false, "Contract was paused by a non-owner");
    });
  });
  it("Owner should be able to pause the contract", function() {
	var token;
    return BloqToken.deployed().then(function(instance) {
	  token = instance;
      return token.pause({from: accounts[0]});
    }).then(function() {
	  return token.paused.call({from: accounts[0]});
    }).then(function(status) {
      assert.equal(status, true, "Contract was paused by a non-owner");
    });
  });
  it("should not send token to whitelisted address because contract is paused", function() {
    var token;

    // Get initial balances of first and second account.
    var account_one = accounts[0];
    var account_two = accounts[1];

    var account_one_starting_balance;
    var account_two_starting_balance;
    var account_one_ending_balance;
    var account_two_ending_balance;

    var amount = 10;

    return BloqToken.deployed().then(function(instance) {
      token = instance;
      return token.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_starting_balance = balance.toNumber();
      return token.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_starting_balance = balance.toNumber();
      return token.transfer(account_two, amount, {from: account_one});
    }).then(function() {
      return token.balanceOf.call(account_one);
    }).then(function(balance) {
      account_one_ending_balance = balance.toNumber();
      return token.balanceOf.call(account_two);
    }).then(function(balance) {
      account_two_ending_balance = balance.toNumber();

      assert.equal(account_one_ending_balance, account_one_starting_balance, "Tokens were transferred");
      assert.equal(account_two_ending_balance, account_two_starting_balance, "Tokens were transferred");
    });
  });
});
