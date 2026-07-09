// SPDX-License-Identifier: MIT
// ⚔️ MACHETE COIN: Cortando con fuerza en la red de Polygon ⚔️
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.0/contracts/token/ERC20/ERC20.sol";

contract MacheteCoin is ERC20 {
    constructor() ERC20("Machete Coin", "MACHETE") {
        // Esto creará 1.000 millones de MACHETES listos en tu billetera
        _mint(msg.sender, 1000000000 * 10**decimals());
    }
}
