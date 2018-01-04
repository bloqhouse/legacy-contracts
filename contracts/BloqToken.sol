pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/token/PausableToken.sol';
import "./Whitelist.sol";

contract BloqToken is PausableToken {

	string public name = 'BloqToken';
	string public symbol = 'BT';
	uint public decimals = 0;
	
	Whitelist public wl;
	uint256[] public wlCaps = [0, 0];

	function BloqToken(address[] _tokenholders, uint256[] _balances, address _whitelist, uint256[] _caps) public {
		require(_tokenholders.length == _balances.length);

		uint256 supply = 0;
		for (uint256 i = 0; i < _tokenholders.length; i++) {
			balances[_tokenholders[i]] = _balances[i];
			supply = supply + _balances[i];
		}

		totalSupply = supply;
		wl = Whitelist(_whitelist);
		wlCaps = _caps;
	}
	
	modifier onlyWhitelisted(address _to, uint256 _value) {
		uint balance = balances[_to].add(_value);
		require(balance <= wlCaps[wl.tierOf(_to)]);
		_;
	}
	
	function updateCap(uint256 _tier, uint256 _value) onlyOwner public {
		wlCaps[_tier] = _value;
	}
	
	/**
	   * @dev Transfer tokens from one address to another by the owner
	   * @param _from address The address which you want to send tokens from
	   * @param _to address The address which you want to transfer to
	   * @param _value uint256 the amount of tokens to be transferred
	*/
	function transferFromByOwner(address _from, address _to, uint256 _value) public onlyOwner whenNotPaused onlyWhitelisted(_to, _value) returns (bool) {
		require(_to != address(0));
		require(_value <= balances[_from]);

		balances[_from] = balances[_from].sub(_value);
		balances[_to] = balances[_to].add(_value);
		Transfer(_from, _to, _value);
		return true;
	}
	
	function transfer(address _to, uint256 _value) public onlyWhitelisted(_to, _value) returns (bool) { return super.transfer(_to, _value); }
	function transferFrom(address _to, uint256 _value) public onlyWhitelisted(_to, _value) returns (bool) { return super.transfer(_to, _value); }
}
