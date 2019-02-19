
export class Token {
  private token: string;
  private header: any;
  private content: any;
  private signature: any;
  private signed: string;

  constructor(token: string) {
    this.token = token;
    if (token) {
      try {
        const parts = token.split('.');
        this.header = JSON.parse(new Buffer(parts[0], 'base64').toString());
        this.content = JSON.parse(new Buffer(parts[1], 'base64').toString());
        this.signature = new Buffer(parts[2], 'base64');
        this.signed = parts[0] + '.' + parts[1];
      } catch (err) {
        this.content = {
          exp: 0
        };
      }
    }
  }

  public toString() {
    return this.token;
  }

  /**
   * Determine if this token is expired.
   *
   * @return {boolean} `true` if it is expired, otherwise `false`.
   */
  public isExpired(): boolean {
    return ((this.content.exp * 1000) < Date.now());
  }

  public getContent(): any {
    return this.content || {};
  }
}
