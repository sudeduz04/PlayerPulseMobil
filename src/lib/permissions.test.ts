import {
  canAccessMatches,
  canAccessPlayers,
  canAccessTeams,
  canAccessTrainings,
  canWriteMatches,
  canWritePlayers,
  canWriteTeams,
  canWriteTrainings,
} from "./permissions";

describe("permissions", () => {
  describe("canWriteTeams", () => {
    it("allows only super_admin", () => {
      expect(canWriteTeams("super_admin")).toBe(true);
      expect(canWriteTeams("manager")).toBe(false);
      expect(canWriteTeams("coach")).toBe(false);
      expect(canWriteTeams("player")).toBe(false);
    });

    it("denies undefined role", () => {
      expect(canWriteTeams(undefined)).toBe(false);
    });
  });

  describe("canWritePlayers", () => {
    it("allows super_admin and coach", () => {
      expect(canWritePlayers("super_admin")).toBe(true);
      expect(canWritePlayers("coach")).toBe(true);
    });

    it("denies manager and player", () => {
      expect(canWritePlayers("manager")).toBe(false);
      expect(canWritePlayers("player")).toBe(false);
    });
  });

  describe("canWriteTrainings", () => {
    it("allows super_admin and coach", () => {
      expect(canWriteTrainings("super_admin")).toBe(true);
      expect(canWriteTrainings("coach")).toBe(true);
    });

    it("denies manager and player", () => {
      expect(canWriteTrainings("manager")).toBe(false);
      expect(canWriteTrainings("player")).toBe(false);
    });
  });

  describe("canWriteMatches", () => {
    it("allows super_admin and coach", () => {
      expect(canWriteMatches("super_admin")).toBe(true);
      expect(canWriteMatches("coach")).toBe(true);
    });

    it("denies manager and player", () => {
      expect(canWriteMatches("manager")).toBe(false);
      expect(canWriteMatches("player")).toBe(false);
    });
  });

  describe("access checks", () => {
    it("grants all admin-tier roles read access", () => {
      const adminRoles = ["super_admin", "manager", "coach"] as const;
      for (const role of adminRoles) {
        expect(canAccessTeams(role)).toBe(true);
        expect(canAccessPlayers(role)).toBe(true);
        expect(canAccessTrainings(role)).toBe(true);
        expect(canAccessMatches(role)).toBe(true);
      }
    });

    it("denies player from access lists", () => {
      expect(canAccessTeams("player")).toBe(false);
      expect(canAccessPlayers("player")).toBe(false);
      expect(canAccessTrainings("player")).toBe(false);
      expect(canAccessMatches("player")).toBe(false);
    });
  });
});
