import { RequestHandler, Request, Response, NextFunction } from "express";
import { z } from "zod";

export function parseBodyMiddleware<T extends z.ZodSchema>(
  schema: T
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = schema.parse(req.body);
      req.body = parsedBody;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: "invalid_request_body",
          errors: error.errors,
        });
        return;
      }

      // TODO: change to use internal app logger
      console.error("Unexpected error during schema parsing:", error);
      res.status(500).json({
        message: "Internal server error",
      });
      return;
    }
  };
}

