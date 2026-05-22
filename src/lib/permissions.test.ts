import {
  canAccessAnalysis,
  canAccessInjuries,
  canAccessLeagues,
  canAccessLineups,
  canAccessMatches,
  canAccessMeasurements,
  canAccessPlayerNotes,
  canAccessPlayers,
  canAccessTeams,
  canAccessTrainings,
  canAccessUsers,
  canImportFixtures,
  canWriteAnalysis,
  canWriteLeagues,
  canWriteLineups,
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

  describe("lineups & analysis", () => {
    it("lineups: super_admin and coach can access and write", () => {
      expect(canAccessLineups("super_admin")).toBe(true);
      expect(canAccessLineups("coach")).toBe(true);
      expect(canWriteLineups("super_admin")).toBe(true);
      expect(canWriteLineups("coach")).toBe(true);
    });

    it("lineups: manager and player denied", () => {
      expect(canAccessLineups("manager")).toBe(false);
      expect(canAccessLineups("player")).toBe(false);
    });

    it("analysis: manager can access but not write", () => {
      expect(canAccessAnalysis("manager")).toBe(true);
      expect(canWriteAnalysis("manager")).toBe(false);
      expect(canWriteAnalysis("coach")).toBe(true);
    });
  });

  describe("admin/league/import roles", () => {
    it("only super_admin can manage users", () => {
      expect(canAccessUsers("super_admin")).toBe(true);
      expect(canAccessUsers("manager")).toBe(false);
      expect(canAccessUsers("coach")).toBe(false);
      expect(canAccessUsers("player")).toBe(false);
    });

    it("leagues are readable by all admin tiers but written by super_admin only", () => {
      expect(canAccessLeagues("manager")).toBe(true);
      expect(canAccessLeagues("coach")).toBe(true);
      expect(canWriteLeagues("manager")).toBe(false);
      expect(canWriteLeagues("super_admin")).toBe(true);
    });

    it("only super_admin imports fixtures", () => {
      expect(canImportFixtures("super_admin")).toBe(true);
      expect(canImportFixtures("coach")).toBe(false);
    });
  });

  describe("health & notes", () => {
    it("manager/coach/super_admin can read+write injuries, measurements, notes", () => {
      const adminTier = ["super_admin", "manager", "coach"] as const;
      for (const role of adminTier) {
        expect(canAccessInjuries(role)).toBe(true);
        expect(canAccessMeasurements(role)).toBe(true);
        expect(canAccessPlayerNotes(role)).toBe(true);
      }
      expect(canAccessInjuries("player")).toBe(false);
    });
  });
});
