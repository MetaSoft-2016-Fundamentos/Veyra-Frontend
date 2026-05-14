export class CreateRelativeCommand {
  private _name: string;
  private _email: string;

  constructor(createRelativeCommand: { name: string, email: string }) {
    this._name = createRelativeCommand.name;
    this._email = createRelativeCommand.email;
  }


  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }
  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }

}
