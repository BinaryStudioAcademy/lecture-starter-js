import controls from '../../constants/controls';

export function getDamage(attacker, defender, defenderIsInBlock) {
    const hitPower = getHitPower(attacker);
    const blockPower = defenderIsInBlock ? getBlockPower(defender) : 0;
    return Math.max(hitPower - blockPower, 0);
}

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1; // random number from 1 to 2
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1; // random number from 1 to 2
    return fighter.defense * dodgeChance;
}

export default async function fight(firstFighter, secondFighter) {
    return new Promise((resolve) => {
        const firstFighterHealthBar = document.getElementById('left-fighter-indicator');
        const secondFighterHealthBar = document.getElementById('right-fighter-indicator');

        let isFirstFighterInBlock = false;
        let isSecondFighterInBlock = false;

        const pressedKeys = new Set();

        const criticalHitCooldowns = {
            [controls.PlayerOneCriticalHitCombination.join()]: 0,
            [controls.PlayerTwoCriticalHitCombination.join()]: 0
        };

        function performAttack(attacker, defender, defenderIsInBlock) {
            const damage = getDamage(attacker, defender, defenderIsInBlock);
            defender.health -= damage;
            updateHealthBar(defender.healthBar, defender.health, defender.maxHealth);
            if (defender.health <= 0) {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
                resolve(attacker);
            }
        }

        function handleKeyDown(event) {
            const key = event.code;
            pressedKeys.add(key);

            switch (key) {
                case controls.PlayerOneAttack:
                    if (!isFirstFighterInBlock) {
                        performAttack(firstFighter, secondFighter, isSecondFighterInBlock);
                    }
                    break;
                case controls.PlayerTwoAttack:
                    if (!isSecondFighterInBlock) {
                        performAttack(secondFighter, firstFighter, isFirstFighterInBlock);
                    }
                    break;
                case controls.PlayerOneBlock:
                    isFirstFighterInBlock = true;
                    break;
                case controls.PlayerTwoBlock:
                    isSecondFighterInBlock = true;
                    break;
            }

            // Check for critical hit combinations
            if (controls.PlayerOneCriticalHitCombination.every(k => pressedKeys.has(k)) && criticalHitCooldowns[controls.PlayerOneCriticalHitCombination.join()] <= Date.now()) {
                secondFighter.health -= 2 * firstFighter.attack;
                criticalHitCooldowns[controls.PlayerOneCriticalHitCombination.join()] = Date.now() + 10000; // 10 seconds cooldown
                updateHealthBar(secondFighterHealthBar, secondFighter.health, secondFighter.maxHealth);
                if (secondFighter.health <= 0) {
                    document.removeEventListener('keydown', handleKeyDown);
                    document.removeEventListener('keyup', handleKeyUp);
                    resolve(firstFighter);
                }
            }

            if (controls.PlayerTwoCriticalHitCombination.every(k => pressedKeys.has(k)) && criticalHitCooldowns[controls.PlayerTwoCriticalHitCombination.join()] <= Date.now()) {
                firstFighter.health -= 2 * secondFighter.attack;
                criticalHitCooldowns[controls.PlayerTwoCriticalHitCombination.join()] = Date.now() + 10000; // 10 seconds cooldown
                updateHealthBar(firstFighterHealthBar, firstFighter.health, firstFighter.maxHealth);
                if (firstFighter.health <= 0) {
                    document.removeEventListener('keydown', handleKeyDown);
                    document.removeEventListener('keyup', handleKeyUp);
                    resolve(secondFighter);
                }
            }
        }

        function handleKeyUp(event) {
            const key = event.code;
            pressedKeys.delete(key);

            switch (key) {
                case controls.PlayerOneBlock:
                    isFirstFighterInBlock = false;
                    break;
                case controls.PlayerTwoBlock:
                    isSecondFighterInBlock = false;
                    break;
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        function updateHealthBar(healthBar, health, maxHealth) {
            healthBar.style.width = `${Math.max((health / maxHealth) * 100, 0)}%`;
        }

        // Assign initial health and health bars
        firstFighter.healthBar = firstFighterHealthBar;
        secondFighter.healthBar = secondFighterHealthBar;
        firstFighter.maxHealth = firstFighter.health;
        secondFighter.maxHealth = secondFighter.health;
    });
}
