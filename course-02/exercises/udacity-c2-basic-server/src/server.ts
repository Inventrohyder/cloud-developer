import bodyParser from "body-parser";
import express, { Request, Response } from "express";

import { cars as cars_list, ICar } from "./cars";

(async () => {
  const cars: ICar[] = cars_list;

  // Create an express application
  const app = express();
  // default port to listen
  const port = 8082;

  // use middleware so post bodies
  // are accessible as req.body.{{variable}}
  app.use(bodyParser.json());

  // Root URI call
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Cloud!");
  });

  // Get a greeting to a specific person
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get("/persons/:name",
    (req: Request, res: Response) => {
      const { name } = req.params;

      if (!name) {
        return res.status(400)
          .send(`name is required`);
      }

      return res.status(200)
        .send(`Welcome to the Cloud, ${name}!`);
    });

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get("/persons/", (req: Request, res: Response) => {
    const { name } = req.query;

    if (!name) {
      return res.status(400)
        .send(`name is required`);
    }

    return res.status(200)
      .send(`Welcome to the Cloud, ${name}!`);
  });

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as
  // an application/json body to {{host}}/persons
  app.post("/persons",
    async (req: Request, res: Response) => {

      const { name } = req.body;

      if (!name) {
        return res.status(400)
          .send(`name is required`);
      }

      return res.status(200)
        .send(`Welcome to the Cloud, ${name}!`);
    });

  // @TODO Add an endpoint to GET a list of cars
  // it should be filterable by make with a query parameter
  app.get("/cars", (req: Request, res: Response) => {
    const { make } = req.query;

    let foundCars: ICar[] = cars;

    if (make) {
      foundCars = cars.filter((car) => car.make === make);
    }

    return res.status(200).send(foundCars);

  });

  // @TODO Add an endpoint to get a specific car
  // it should require id
  // it should fail gracefully if no matching car is found
  app.get("/cars/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    const car: ICar = cars.find((x: ICar) => x.id === parseInt(id, 10));

    if (car) {
      return res.status(200).send(car);
    }
    return res.status(404).send(`Car with id(${id}) not found`);
  });

  /// @TODO Add an endpoint to post a new car to our list
  // it should require id, type, model, and cost
  app.post("/cars", async (req: Request, res: Response) => {
    const { id, make, type, model, cost } = req.body;

    if (!id) {
      return res.status(400).send("id is required");
    }
    if (!type) {
      return res.status(400).send("type is required");
    }
    if (!model) {
      return res.status(400).send("model is required");
    }
    if (!cost) {
      return res.status(400).send("cost is required");
    }

    const car: ICar = {
      cost,
      id,
      make,
      model,
      type,
    };

    cars.push(car);

    return res.status(201).send(car);

  });

  // Start the Server
  app.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log(`server running http://localhost:${port}`);
    // tslint:disable-next-line: no-console
    console.log(`press CTRL+C to stop server`);
  });
})();
