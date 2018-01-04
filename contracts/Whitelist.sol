pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Whitelist is Ownable {

	mapping (address => uint8) public tierOf;
	mapping (address => bool) public authorized;  

	function Whitelist(address[] _tokenholders, uint8[] _tiers) public {
		updateTierBatch(_tokenholders, _tiers);
	}
	
	function authorize(address _pubkey, bool _value) onlyOwner public {
		authorized[_pubkey] = _value;
	}
	
	modifier onlyAuthorized() {
		require(msg.sender == owner || authorized[msg.sender]);
		_;
	}
	
	// Does this have a gas advantage over using batch function for a single update?
	function updateTier(address _tokenholder, uint8 _tier) onlyAuthorized public {
		tierOf[_tokenholder] = _tier;
	}
	
	function updateTierBatch(address[] _tokenholders, uint8[] _tiers) onlyAuthorized public {
		require(_tokenholders.length == _tiers.length);
		
		for (uint256 i = 0; i < _tokenholders.length; i++) {
		  tierOf[_tokenholders[i]] = _tiers[i];
		}
	}	
}
