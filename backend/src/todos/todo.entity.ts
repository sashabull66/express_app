export class TodoEntity {
  constructor(
    private readonly _title: string,
    private readonly _description: string,
    private readonly _done: boolean,
    private readonly _userId: string,
  ) {}

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get done(): boolean {
    return this._done;
  }

  get userId(): string {
    return this._userId;
  }
}
