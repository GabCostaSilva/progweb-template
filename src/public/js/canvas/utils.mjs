export const utils = {
  distance(p0, p1) {
    let dX = p0.x - p1.x,
        dY = p0.y - p1.y
    return Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2))
  },
  distanceXY (x0, y0, x1, y1) {
      let dX = x0 - x1,
          dY = y0 - y1
      return Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2))
  },
  circleCollision(c0, c1) {
    return utils.distance(c0, c1) <= c0.radius + c1.radius
  },
  circlePointCollision(x, y, circle) {
    return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius
  },
  pointInRect(x, y, rect) {
    return  utils.inRange(x, rect.x, rect.x + rect.width) &&
            utils.inRange(y, rect.y, rect.y + rect.height)
  },
  inRange(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max)
  },
  rangeIntersect(min0, max0, min1, max1) {
    return  Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1)
  },
  rectIntersect(r0, r1) {
    return  this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height)
  }
}
