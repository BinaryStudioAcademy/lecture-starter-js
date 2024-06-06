import controls from '../../constants/controls';

const getRandomNumber = () => Math.random() + 1;

export function getHitPower(fighter) {
    // return hit power
    return fighter.attack * getRandomNumber();
}

export function getBlockPower(fighter) {
    // return block power
    return fighter.defense * getRandomNumber();
}

export function getDamage(attacker, defender) {
    // return damage
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    const damage = defender.block ? 0 : hitPower - blockPower;
    return damage > 0 ? damage : 0;
}

function criticalAttack(attacker, defender) {
    const criticalHit = attacker.attack * 2;
    const blockPower = getBlockPower(defender);
    const damage = defender.block ? 0 : criticalHit - blockPower;
    return damage;
}

function calculateHealthIndicatorValue(initialHealth, health) {
    return (health / initialHealth) * 100;
}

function changeHealthIndicatorValue(indicator, value) {
    if (indicator.includes('left')) {
        const element = document.getElementById('left-fighter-indicator');
        element.style.width = `${value}%`;
    } else if (indicator.includes('right')) {
        const element = document.getElementById('right-fighter-indicator');
        element.style.width = `${value}%`;
    }
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over

        const playerOne = { ...firstFighter, initialHealth: firstFighter.health, block: false, indicator: 'left' };
        const playerTwo = { ...secondFighter, initialHealth: secondFighter.health, block: false, indicator: 'right' };
        let lastCriticalPlayerOneStrikeTime = 0;
        let lastCriticalPlayerTwoStrikeTime = 0;
        const playerOneCriticalStrikeKeys = Object.fromEntries(
            controls.PlayerOneCriticalHitCombination.map(key => [key, false])
        );
        const playerTwoCriticalStrikeKeys = Object.fromEntries(
            controls.PlayerTwoCriticalHitCombination.map(key => [key, false])
        );

        document.addEventListener('keydown', event => {
            if (event.code === controls.PlayerOneAttack) {
                // first fighter hits second fighter
                const damage = playerOne.block ? 0 : getDamage(playerOne, playerTwo);
                playerTwo.health -= damage;
                changeHealthIndicatorValue(
                    playerTwo.indicator,
                    calculateHealthIndicatorValue(playerTwo.initialHealth, playerTwo.health)
                );
            } else if (event.code in playerOneCriticalStrikeKeys) {
                playerOneCriticalStrikeKeys[event.code] = true;

                const isCriticalStrike = Object.values(playerOneCriticalStrikeKeys).every(Boolean);
                const timeNow = new Date().getTime();

                if (isCriticalStrike && timeNow - lastCriticalPlayerOneStrikeTime > 10000) {
                    const damage = criticalAttack(playerOne, playerTwo);
                    playerTwo.health -= damage;
                    changeHealthIndicatorValue(
                        playerTwo.indicator,
                        calculateHealthIndicatorValue(playerTwo.initialHealth, playerTwo.health)
                    );
                    lastCriticalPlayerOneStrikeTime = timeNow;
                }
            } else if (event.code === controls.PlayerOneBlock) {
                playerOne.block = true;
            }

            if (event.code === controls.PlayerTwoAttack) {
                // second fighter hits first fighter
                const damage = playerTwo.block ? 0 : getDamage(playerTwo, playerOne);
                playerOne.health -= damage;
                changeHealthIndicatorValue(
                    playerOne.indicator,
                    calculateHealthIndicatorValue(playerOne.initialHealth, playerOne.health)
                );
            } else if (event.code in playerTwoCriticalStrikeKeys) {
                playerTwoCriticalStrikeKeys[event.code] = true;

                const isCriticalStrike = Object.values(playerTwoCriticalStrikeKeys).every(Boolean);
                const timeNow = new Date().getTime();

                if (isCriticalStrike && timeNow - lastCriticalPlayerTwoStrikeTime > 10000) {
                    const damage = criticalAttack(playerOne, playerTwo);
                    playerOne.health -= damage;
                    changeHealthIndicatorValue(
                        playerOne.indicator,
                        calculateHealthIndicatorValue(playerOne.initialHealth, playerOne.health)
                    );
                    lastCriticalPlayerTwoStrikeTime = timeNow;
                }
            } else if (event.code === controls.PlayerTwoBlock) {
                playerTwo.block = true;
            }

            if (playerOne.health <= 0 || playerTwo.health <= 0) {
                const winner = playerOne.health > 0 ? playerOne : playerTwo;
                resolve(winner);
            }
        });

        document.addEventListener('keyup', event => {
            if (event.code === controls.PlayerOneBlock) {
                playerOne.block = !playerOne.block;
            }

            if (event.code === controls.PlayerTwoBlock) {
                playerTwo.block = !playerTwo.block;
            }

            if (event.code in playerOneCriticalStrikeKeys) {
                playerOneCriticalStrikeKeys[event.code] = false;
            }

            if (event.code in playerTwoCriticalStrikeKeys) {
                playerTwoCriticalStrikeKeys[event.code] = false;
            }
        });
    });
}
