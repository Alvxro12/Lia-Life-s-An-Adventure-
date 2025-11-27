import { rectIntersection, type CollisionDetection } from "@dnd-kit/core";

/**
 * Colisión estrictamente horizontal:
 * ignora centros verticales y solo compara rectángulos por X.
 */
export const horizontalStrictCollision: CollisionDetection = (args) => {
    const collisions = rectIntersection(args);

    if (collisions.length > 0) {
        return collisions;
    }

    return [];
};
