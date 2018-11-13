// flow-typed signature: cfffb76549ad83442c7aebd40cd816bc
// flow-typed version: 587cb4dca6/shortid_v2.2.x/flow_>=v0.25.x

declare module 'shortid' {
  declare type ShortIdModule = {|
    (): string,
    generate(): string,
    seed(seed: number): ShortIdModule,
    worker(workerId: number): ShortIdModule,
    characters(characters: string): string,
    decode(id: string): { version: number, worker: number },
    isValid(id: mixed): boolean,
  |};
  declare module.exports: ShortIdModule;
};
