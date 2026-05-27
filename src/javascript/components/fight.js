/* eslint-disable no-use-before-define */
import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        const leftHealthBar = document.getElementById('left-fighter-indicator');
        const rightHealthBar = document.getElementById('right-fighter-indicator');

        const initialHealth = {
            left: firstFighter.health,
            right: secondFighter.health
        };

        const health = {
            left: firstFighter.health,
            right: secondFighter.health
        };

        const pressedKeys = new Set();
        const isBlocking = {
            left: false,
            right: false
        };

        const critical = {
            left: { cooldownEndsAt: 0, isComboActive: false },
            right: { cooldownEndsAt: 0, isComboActive: false }
        };

        const clampHealth = value => (value < 0 ? 0 : value);

        const updateBar = (barEl, current, initial) => {
            const bar = barEl;
            if (!bar) return;
            const safeInitial = initial > 0 ? initial : 1;
            const widthPercent = (current / safeInitial) * 100;
            bar.style.width = `${widthPercent}%`;
        };

        const updateUI = () => {
            updateBar(leftHealthBar, health.left, initialHealth.left);
            updateBar(rightHealthBar, health.right, initialHealth.right);
        };

        const syncBlockState = () => {
            isBlocking.left = pressedKeys.has(controls.PlayerOneBlock);
            isBlocking.right = pressedKeys.has(controls.PlayerTwoBlock);
        };

        const stopFight = winner => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            resolve(winner);
        };

        const applyDamage = (attacker, defender, defenderSide) => {
            const damage = getDamage(attacker, defender);
            health[defenderSide] = clampHealth(health[defenderSide] - damage);
            updateUI();

            if (health[defenderSide] <= 0) {
                stopFight(attacker);
            }
        };

        const applyCriticalDamage = (attacker, defenderSide) => {
            const damage = 2 * attacker.attack;
            health[defenderSide] = clampHealth(health[defenderSide] - damage);
            updateUI();

            if (health[defenderSide] <= 0) {
                stopFight(attacker);
            }
        };

        const isComboPressed = (combo, keys) => combo.every(key => keys.has(key));

        const onKeyDown = event => {
            const { code } = event;
            if (pressedKeys.has(code)) return;
            pressedKeys.add(code);
            syncBlockState();

            const now = Date.now();

            const isLeftComboPressed = isComboPressed(controls.PlayerOneCriticalHitCombination, pressedKeys);
            if (isLeftComboPressed && !critical.left.isComboActive && now >= critical.left.cooldownEndsAt) {
                critical.left.cooldownEndsAt = now + 10000;
                critical.left.isComboActive = true;
                applyCriticalDamage(firstFighter, 'right');
                return;
            }

            const isRightComboPressed = isComboPressed(controls.PlayerTwoCriticalHitCombination, pressedKeys);
            if (isRightComboPressed && !critical.right.isComboActive && now >= critical.right.cooldownEndsAt) {
                critical.right.cooldownEndsAt = now + 10000;
                critical.right.isComboActive = true;
                applyCriticalDamage(secondFighter, 'left');
                return;
            }

            if (code === controls.PlayerOneAttack && !isBlocking.left) {
                applyDamage(firstFighter, secondFighter, 'right');
            }

            if (code === controls.PlayerTwoAttack && !isBlocking.right) {
                applyDamage(secondFighter, firstFighter, 'left');
            }
        };

        const onKeyUp = event => {
            pressedKeys.delete(event.code);
            syncBlockState();

            if (!isComboPressed(controls.PlayerOneCriticalHitCombination, pressedKeys)) {
                critical.left.isComboActive = false;
            }
            if (!isComboPressed(controls.PlayerTwoCriticalHitCombination, pressedKeys)) {
                critical.right.isComboActive = false;
            }
        };

        updateUI();
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
    });
}

export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = getBlockPower(defender);
    const damage = hitPower - blockPower;
    return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
    return fighter.attack * (1 + Math.random());
}

export function getBlockPower(fighter) {
    return fighter.defense * (1 + Math.random());
}
