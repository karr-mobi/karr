import { Hono } from "hono"

import trips from "./trips"

/**
 * Federation endpoint
 */
const hono = new Hono()

hono.route("/trips", trips)

export default hono
