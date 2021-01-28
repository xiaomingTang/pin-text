export abstract class Model {
  abstract fromJson(json: object): void;

  abstract toJson(): object;
}
