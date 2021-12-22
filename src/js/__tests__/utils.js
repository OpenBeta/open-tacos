import { getScoreForYdsGrade } from "../utils";

describe("utils", () => {
  it("Converts 5.11a yds to score 112", () => {
    expect(getScoreForYdsGrade("5.11a")).toBe(112);
  });
  it("Converts 5.9+ yds to score 91", () => {
    expect(getScoreForYdsGrade("5.9+")).toBe(91);
  });
  it("Converts 5.14a/b yds to score 143", () => {
    expect(getScoreForYdsGrade("5.14a/b ")).toBe(143);
  });
  it("Converts 5.14d yds to score 148", () => {
    expect(getScoreForYdsGrade("5.14d ")).toBe(148);
  });
});
