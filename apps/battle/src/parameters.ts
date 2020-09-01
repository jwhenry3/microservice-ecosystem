export const parameters = {
  pointsPerLevel        : 10,
  maxLevel              : 10,
  baseMaxExp            : 100,
  maxExpModifier: (level: number) => parameters.baseMaxExp + (parameters.baseMaxExp * (level * level) / 2),
};
