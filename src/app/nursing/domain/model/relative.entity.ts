export class Relative {
  private _id: number;
  private _name: string;
  private _email : string;
  private _residentId: number;

  constructor(relative: { id: number, name: string, email: string, residentId: number }) {
    this._id = relative.id;
    this._name = relative.name;
    this._email = relative.email;
    this._residentId = relative.residentId;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
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

  get residentId(): number {
    return this._residentId;
  }
  set residentId(value: number) {
    this._residentId = value;
  }

}
