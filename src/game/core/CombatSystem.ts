export class CombatSystem {
  applyDamage(hp: number, damage: number): number {
    return Math.max(0, hp - damage);
  }
}
