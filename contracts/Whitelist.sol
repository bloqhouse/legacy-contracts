pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract Whitelist is Ownable {

	mapping (address => uint8) public tierOf; 

	function Whitelist(address[] _tokenholders, uint8[] _tiers) public {
		require(_tokenholders.length == _tiers.length);

		for (uint256 i = 0; i < _tokenholders.length; i++) {
		  tierOf[_tokenholders[i]] = _tiers[i];
		}
	}
	
	function updateTier(address _tokenholder, uint8 _tier) onlyOwner public {
		tierOf[_tokenholder] = _tier;
	}
	
}
