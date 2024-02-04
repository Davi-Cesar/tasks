import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile("db.json", JSON.stringify(this.#database));
  }

  select(table) {
    const data = this.#database[table] ?? [];
    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id == id);
    const { description, title } = data;

    if (rowIndex > -1) {
      description
        ? ((this.#database[table][rowIndex].description = description),
          (this.#database[table][rowIndex].update_at = new Date()))
        : "";
      title
        ? ((this.#database[table][rowIndex].title = title),
          (this.#database[table][rowIndex].update_at = new Date()))
        : "";
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id == id);
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  completed(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id == id);
    if (rowIndex > -1) {
      this.#database[table][rowIndex].completed_at = true;
      this.#persist();
    }
  }
}
