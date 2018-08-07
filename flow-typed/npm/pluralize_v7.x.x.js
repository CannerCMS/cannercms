// flow-typed signature: 61608247abf5336bd06639770e399f80
// flow-typed version: d23eff98ca/pluralize_v7.x.x/flow_>=v0.25.x

declare module "pluralize" {
  declare module.exports: {
    (word: string, count?: number, inclusive?: boolean): string,

    addIrregularRule(single: string, plural: string): void,
    addPluralRule(rule: string | RegExp, replacement: string): void,
    addSingularRule(rule: string | RegExp, replacement: string): void,
    addUncountableRule(ord: string | RegExp): void,
    plural(word: string): string,
    singular(word: string): string,
    isPlural(word: string): boolean,
    isSingular(word: string): boolean
  };
}
