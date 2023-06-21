import controls from '../../constants/controls';

const GAME_KEYS = Object.values(controls).flat(2);
const POINTS = 10;
const POSITIONS = {
    LEFT: 'left',
    RIGHT: 'right'
};
const ATTACK_TYPES = {
    PUNCH: 'punch',
    FIREBALL: 'fireball'
};

function updateHealthIndicator(currentHealth, health, position) {
    const healthIndicator = document.getElementById(`${position}-fighter-indicator`);
    const indicatorWidth = Math.max(0, (currentHealth * 100) / health);
    healthIndicator.style.width = `${indicatorWidth}%`;
}

function showAttack(position, attack) {
    const attackElement = document.getElementById(`${position}-${attack}`);
    attackElement.classList.add(`arena___${position}-${attack}-show`);
    setTimeout(() => {
        attackElement.classList.remove(`arena___${position}-${attack}-show`);
    }, 300);
}

function toggleShield(show, position) {
    const shield = document.getElementById(`${position}-shield`);
    if (show) {
        shield.style.visibility = 'visible';
    } else {
        shield.style.visibility = 'hidden';
    }
}

function toggleCritSignal(show, position) {
    const indicator = document.getElementById(`${position}-crit-signal`);
    if (show) {
        indicator.style.visibility = 'visible';
    } else {
        indicator.style.visibility = 'hidden';
    }
}

function updateRageIndicator(position, width) {
    const rageIndicator = document.getElementById(`${position}-rage-indicator`);
    rageIndicator.style.width = `${width}%`;
}

const createCritPointsUpdatedHandler = position => (currentPoints, canCrit) => {
    if (currentPoints === 0) {
        toggleCritSignal(false, position);
    }

    if (canCrit) {
        toggleCritSignal(true, position);
    }

    updateRageIndicator(position, currentPoints * 10);
};

const createIsBlockingChangedHandler = position => isBlocking => {
    toggleShield(isBlocking, position);
};

const createIsDamageReceivedHandler = position => (currentHealth, health) => {
    updateHealthIndicator(currentHealth, health, position);
};

const createIsAttackingHandler = position => attack => {
    showAttack(position, attack);
};

export const createFighterConfigs = position => ({
    onPointsUpdated: createCritPointsUpdatedHandler(position),
    onIsBlockingChanged: createIsBlockingChangedHandler(position),
    onDamageReceived: createIsDamageReceivedHandler(position),
    onAttacking: createIsAttackingHandler(position)
});

function getRandomNumberFromRange(min, max) {
    return Math.random() * (max - min) + min;
}

function createArenaFighter(fighter, configs) {
    const { onPointsUpdated, onIsBlockingChanged, onDamageReceived, onAttacking } = configs;

    return {
        ...fighter,
        currentHealth: fighter.health,
        currentCritPoints: 0,
        isBlocking: false,
        timerId: null,
        receiveDamage(value) {
            this.currentHealth -= value;
            onDamageReceived(this.currentHealth, this.health);
        },
        setIsBlocking(value) {
            this.isBlocking = value;
            onIsBlockingChanged(value);
        },
        doAttack(defender, damage) {
            defender.receiveDamage(damage);
            onAttacking(ATTACK_TYPES.PUNCH);
        },
        doCritAttack(defender) {
            if (!this.isCanDoCrit()) return;

            this.restartCritPoints();
            defender.receiveDamage(this.attack * 2);
            onAttacking(ATTACK_TYPES.FIREBALL);
        },
        isCanDoCrit() {
            return this.currentCritPoints === POINTS;
        },
        restartCritPoints() {
            this.currentCritPoints = 0;
            onPointsUpdated(this.currentCritPoints, false);

            this.timerId = setInterval(() => {
                this.currentCritPoints += 1;

                const canDoCrit = this.isCanDoCrit();

                onPointsUpdated(this.currentCritPoints, canDoCrit);

                if (canDoCrit) {
                    clearInterval(this.timerId);
                }
            }, 1000);
        }
    };
}

function applyFighterAttack(attacker, defender) {
    if (attacker.isBlocking) {
        return;
    }

    if (defender.isBlocking) {
        attacker.doAttack(defender, 0);
        return;
    }

    attacker.doAttack(defender, getDamage(attacker, defender));
}

function processFightAction(firstFighter, secondFighter, keyMap, currentCode) {
    if (currentCode === controls.PlayerOneBlock) {
        firstFighter.setIsBlocking(true);
    }
    if (currentCode === controls.PlayerTwoBlock) {
        secondFighter.setIsBlocking(true);
    }
    if (currentCode === controls.PlayerOneAttack) {
        applyFighterAttack(firstFighter, secondFighter, keyMap);
        return;
    }
    if (currentCode === controls.PlayerTwoAttack) {
        applyFighterAttack(secondFighter, firstFighter, keyMap);
        return;
    }
    if (controls.PlayerOneCriticalHitCombination.every(code => keyMap.has(code))) {
        firstFighter.doCritAttack(secondFighter);
        return;
    }
    if (controls.PlayerTwoCriticalHitCombination.every(code => keyMap.has(code))) {
        secondFighter.doCritAttack(firstFighter);
    }
}

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        const firstArenaFighter = createArenaFighter(firstFighter, createFighterConfigs(POSITIONS.LEFT));
        const secondArenaFighter = createArenaFighter(secondFighter, createFighterConfigs(POSITIONS.RIGHT));
        firstArenaFighter.restartCritPoints();
        secondArenaFighter.restartCritPoints();

        const pressedKeys = new Map();
        document.addEventListener('keydown', e => {
            if (e.repeat || !GAME_KEYS.some(key => key === e.code)) {
                return;
            }
            pressedKeys.set(e.code, true);
            processFightAction(firstArenaFighter, secondArenaFighter, pressedKeys, e.code);

            if (firstArenaFighter.currentHealth <= 0) {
                resolve(secondFighter);
            } else if (secondArenaFighter.currentHealth <= 0) {
                resolve(firstFighter);
            }
        });
        document.addEventListener('keyup', e => {
            if (e.code === controls.PlayerOneBlock) {
                firstArenaFighter.setIsBlocking(false);
            }
            if (e.code === controls.PlayerTwoBlock) {
                secondArenaFighter.setIsBlocking(false);
            }
            pressedKeys.delete(e.code);
        });
    });
}

export function getDamage(attacker, defender) {
    // return damage
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
    // return hit power
    const criticalHitChance = getRandomNumberFromRange(1, 2);
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    // return block power
    const dodgeChance = getRandomNumberFromRange(1, 2);
    return fighter.defense * dodgeChance;
}
