export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);          // llama al constructor de Error con el mensaje
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflicto") {
    super(message, 409);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Solicitud inválida") {
    super(message, 400);
  }
}